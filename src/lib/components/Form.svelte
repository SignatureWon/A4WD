<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  import {
    Button,
    InlineNotification,
    Modal,
    NotificationActionButton,
  } from "carbon-components-svelte";
  import InputText from "./input/InputText.svelte";
  import InputImage from "./input/InputImage.svelte";
  import InputEditorJs from "./input/InputEditorJs.svelte";
  import InputRichtext from "./input/InputRichtext.svelte";
  import InputDateRange from "./input/InputDateRange.svelte";
  import InputHidden from "./input/InputHidden.svelte";
  import InputSwitch from "./input/InputSwitch.svelte";
  import InputTextarea from "./input/InputTextarea.svelte";
  import InputSelect from "./input/InputSelect.svelte";
  import InputNumber from "./input/InputNumber.svelte";
  import InputRelated from "./input/InputRelated.svelte";
  import InputFile from "./input/InputFile.svelte";

  export let form = {
    name: "",
    groups: [
      {
        name: "",
        description: "",
        fields: [],
      },
    ],
  };
  export let table = "";
  export let fields = "*";
  export let update = 1;
  export let duplicate = false;

  let id = $page.params.id;
  let path = $page.url.pathname.replace(`/${id}`, "");
  let show = false;
  let record = {};
  let errors = {};
  let loading = false;
  let message = "";
  let modalDelete = false;
  let modalDuplicate = false;
  let duplicatedRecord = {};

  onMount(async () => {
    if (id === "add") {
      form.groups.forEach((group) => {
        group.fields.forEach((field) => {
          if (field.type === "number") {
            record[field.name] = field.default || 0;
          } else if (field.type === "switch") {
            record[field.name] = field.default ? true : false;
          } else if (field.type === "daterange") {
            record[field.name] = field.default || dayjs();
            record[field.name2] = field.default || dayjs();
          } else {
            record[field.name] = field.default || null;
          }
        });
      });
    } else {
      getRecord();
    }
  });

  const handleError = (error) => {
    if (error.code === "23503") {
      error.message =
        "You are not able to delete because of associated records. Please remove or update all the associated records first";
    } else if (error.code === "PGRST116") {
      error.message = "No records found";
    }

    return error;
  };

  const slugify = (str) =>
    str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const getRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .select(fields)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        record = data;
      }
    } catch (error) {
      errors = handleError(error);
    } finally {
      loading = false;
    }
  };

  const updateRecord = async () => {
    try {
      loading = true;
      // remove foreign keys if null
      for (const [key, value] of Object.entries(record)) {
        if (["vehicles", "depots", "suppliers"].includes(key)) {
          if (value === "") {
            delete record[key];
          }
        }
      }
      if (["contents", "vehicles"].includes(table)) {
        record.slug = slugify(record.name);
      }
      const { data, error } = await supabase
        .from(table)
        .update(record)
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
      update++;
    }
  };
  const addRecord = async () => {
    try {
      loading = true;
      // remove foreign keys if null
      for (const [key, value] of Object.entries(record)) {
        if (["vehicles", "depots", "suppliers"].includes(key)) {
          if (value === "") {
            delete record[key];
          }
        }
      }
      if (["contents", "vehicles"].includes(table)) {
        record.slug = slugify(record.name);
      }

      const { data, error } = await supabase
        .from(table)
        .insert([record])
        .select()
        .single();

      if (error) throw error;

      record = data;
      goto(`${path}/${record.id}`);
    } catch (error) {
      errors = error;
    } finally {
      message = "Created successfully";
      show = true;
      loading = false;
      update++;
    }
  };

  const duplicateRecord = async () => {
    let dupRecord = record;
    dupRecord.name += " Copy";

    if (dupRecord.hasOwnProperty("slug")) {
      dupRecord.slug += "-copy";
    }
    delete dupRecord["id"];

    if (dupRecord.hasOwnProperty("created_at")) {
      delete dupRecord["created_at"];
    }
    if (dupRecord.hasOwnProperty("updated_at")) {
      delete dupRecord["updated_at"];
    }

    try {
      loading = true;

      const { data, error } = await supabase
        .from(table)
        .insert([dupRecord])
        .select()
        .single();

      if (error) throw error;

      duplicatedRecord = data;
    } catch (error) {
      errors = error;
    } finally {
      message = "Duplicated successfully";
      show = true;
      loading = false;
      modalDuplicate = false;
      // update++;
      // window.location.href =
      goto(`${path}/${duplicatedRecord.id}`);
    }
  };

  const deleteRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;
      goto(path);
    } catch (error) {
      console.log(error);
      errors = handleError(error);
    } finally {
      loading = false;
      message = "Deleted successfully";
      show = true;
    }
  };

  const getRelated = async (table, filters = []) => {
    let records = [];
    try {
      loading = true;

      let query = supabase.from(table).select();

      filters.forEach((filter) => {
        if (filter.type === "eq") {
          query = query.eq(filter.column, filter.value);
        }
      });

      const { data, error } = await query;

      if (data) {
        records = data;
      }

      if (error) throw error;
    } catch (error) {
      errors = handleError(error);
    } finally {
      loading = false;
      return records;
    }
  };

  $: {
    if (id !== $page.params.id) {
      console.log("changed");
      id = $page.params.id;
      getRecord();
    }
  }
</script>

<Loading {loading} />
{#if errors.code}
  <InlineNotification
    hideCloseButton
    lowContrast
    kind="error"
    title="Error:"
    subtitle={errors.message}
  >
    <svelte:fragment slot="actions">
      <NotificationActionButton on:click={() => goto(path)}>
        Back
      </NotificationActionButton>
    </svelte:fragment>
  </InlineNotification>
{:else}
  <Toast bind:show {message} />

  <div class="bg-white">
    {#if form.name !== ""}
      <h3 class="font-medium text-lg p-4 border-b border-gray-200 bg-gray-50">
        {form.name}
      </h3>
    {/if}
    <form
      on:submit={() => {
        if (id === "add") {
          addRecord();
        } else {
          updateRecord();
        }
      }}
    >
      {#each form.groups as group}
        <div
          class="grid md:grid-cols-3 gap-5 px-5 py-8 border-b border-gray-200"
        >
          {#if group.name !== ""}
            <div>
              <h4 class="font-bold">
                {group.name}
              </h4>
              {#if group.description !== ""}
                <p class="text-gray-400">
                  {group.description}
                </p>
              {/if}
            </div>
          {/if}
          <div class={group.name !== "" ? "md:col-span-2" : "md:col-span-3"}>
            <div class="flex-1 grid grid-cols-2 gap-4">
              {#each group.fields as field}
                <div
                  class={field.size === "half" ? "col-span-1" : "col-span-2"}
                >
                  {#if field.type === "textarea"}
                    <InputTextarea {field} bind:record />
                  {:else if field.type === "number"}
                    <InputNumber {field} bind:record />
                  {:else if field.type === "related"}
                    <InputRelated {field} bind:record {getRelated} />
                  {:else if field.type === "select"}
                    <InputSelect {field} bind:record />
                  {:else if field.type === "switch"}
                    <InputSwitch {field} bind:record />
                  {:else if field.type === "image"}
                    {#if id !== "add"}
                      <InputImage {field} bind:record {updateRecord} />
                    {/if}
                  {:else if field.type === "file"}
                    {#if id !== "add"}
                      <InputFile {field} bind:record {updateRecord} />
                    {/if}
                  {:else if field.type === "hidden"}
                    <InputHidden {field} bind:record />
                  {:else if field.type === "daterange"}
                    <InputDateRange {field} bind:record />
                  {:else if field.type === "richtext"}
                    <InputRichtext {field} bind:record />
                  {:else if field.type === "editorjs"}
                    <InputEditorJs {field} bind:record />
                  {:else}
                    <InputText {field} bind:record />
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        </div>
      {/each}
      <footer class="flex p-4  bg-gray-50">
        <div class="flex-1">
          <div class="flex">
            {#if id !== "add"}
              <Button
                kind="danger-tertiary"
                on:click={() => (modalDelete = true)}
              >
                <span class="hidden md:inline-block">Delete</span>
                <span class="inline-block md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="w-5 h-5"
                    fill="currentColor"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
                    /></svg
                  >
                </span>
              </Button>
            {/if}
            {#if duplicate}
              <Button kind="ghost" on:click={() => (modalDuplicate = true)}>
                <span class="hidden md:inline-block">Duplicate</span>
                <span class="inline-block md:hidden">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="w-5 h-5"
                    fill="currentColor"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"
                    /></svg
                  >
                </span>
              </Button>
            {/if}
          </div>
        </div>
        <div class="mx-1">
          <Button kind="ghost" on:click={() => goto(path)}>Back</Button>
        </div>
        <div>
          <Button type="submit">
            {id === "add" ? "Create" : "Update"}
          </Button>
        </div>
      </footer>
    </form>
  </div>
  <Modal
    size="xs"
    bind:open={modalDelete}
    modalHeading="Delete record"
    primaryButtonText="Confirm"
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => (modalDelete = false)}
    on:submit={() => deleteRecord()}
  >
    <p>Do you want to delete this record?</p>
  </Modal>
  <Modal
    size="xs"
    bind:open={modalDuplicate}
    modalHeading="Duplicate record"
    primaryButtonText="Confirm"
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => (modalDuplicate = false)}
    on:submit={() => duplicateRecord()}
  >
    <p>Do you want to duplicate this record?</p>
  </Modal>
{/if}
