<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  import {
    Button,
    DatePicker,
    DatePickerInput,
    FileUploader,
    InlineNotification,
    Modal,
    NotificationActionButton,
    NumberInput,
    Select,
    SelectItem,
    TextArea,
    TextInput,
    Toggle,
  } from "carbon-components-svelte";
  import InputText from "./input/InputText.svelte";
  import InputImage from "./input/InputImage.svelte";
  import InputRichtext from "./input/InputRichtext.svelte";
  import InputRichtextOld from "./input/InputRichtextOld.svelte";
  import InputDateRange from "./input/InputDateRange.svelte";
  import InputHidden from "./input/InputHidden.svelte";
  import InputSwitch from "./input/InputSwitch.svelte";
  import InputTextarea from "./input/InputTextarea.svelte";
  import InputSelect from "./input/InputSelect.svelte";
  import InputNumber from "./input/InputNumber.svelte";
  import InputRelated from "./input/InputRelated.svelte";
  import InputFile from "./input/InputFile.svelte";

  // import Quill from "quill";

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

  let id = $page.params.id;
  let path = $page.url.pathname.replace(`/${id}`, "");
  let show = false;
  let record = {};
  let errors = {};
  let loading = false;
  let message = "";
  let modalDelete = false;

  // let editor;

  // export let toolbarOptions = [
  //   [{ header: 1 }, { header: 2 }, "blockquote", "link", "image", "video"],
  //   ["bold", "italic", "underline", "strike"],
  //   [{ list: "ordered" }, { list: "ordered" }],
  //   [{ align: [] }],
  //   ["clean"],
  // ];

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
    // var quill = new Quill("#editor", {
    //   theme: "snow",
    // });

    // const { default: Quill } = await import("quill");

    // let quill = new Quill(editor, {
    //   modules: {
    //     toolbar: toolbarOptions,
    //   },
    //   theme: "snow",
    //   placeholder: "Write your story...",
    // });
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

  const getRelated = async (related_table) => {
    let records = [];
    try {
      loading = true;
      const { data, error } = await supabase.from(related_table).select(fields);

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
    id = $page.params.id;
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
                    {:else if field.type === "richtextold"}
                    <InputRichtextOld {field} bind:record />
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
          {#if id !== "add"}
            <Button
              kind="danger-tertiary"
              on:click={() => (modalDelete = true)}
            >
              Delete
            </Button>
          {/if}
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
{/if}
