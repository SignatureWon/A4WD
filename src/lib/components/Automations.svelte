<script>
  import { supabase } from "$lib/supabaseClient";
  import { userGroup } from "$lib/constants";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import {
    Accordion,
    AccordionItem,
    Button,
    Modal,
    MultiSelect,
    NumberInput,
    Select,
    SelectItem,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";
  import { bind, text } from "svelte/internal";

  export let ref = "id";
  let id = ref;

  if (ref === "id") {
    id = $page.params.id;
  }

  let fields = [];
  let records = [];
  let type = "text";
  let loading = false;
  let show = false;
  let message = "";
  let errors = {};
  let modalDelete = false;
  let deleteId = "";

  onMount(() => {
    getRecord();
  });

  const getRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("automations")
        .select()
        .eq("ref", id);

      if (error) throw error;

      if (data) {
        records = data;
      }
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }

    try {
      loading = true;
      const { data, error } = await supabase
        .from("custom_fields")
        .select("fields")
        .eq("ref", id)
        .single();

      if (error) throw error;

      if (data) {
        let arr = [];
        data.fields.forEach((field) => {
          if (field.type === "date") {
            arr.push(field);
          }
        });
        fields = [...arr];
      }
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }
  };
  const addRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("automations")
        .insert([{ ref: id }])
        .select()
        .single();

      if (error) throw error;
      records = [...records, data];
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }
  };
  const updateRecord = async (record) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("automations")
        .update({
          name: record.name,
          recipients: record.recipients,
          value: record.value,
          unit: record.unit,
          message: record.message,
          field: record.field,
        })
        .eq("id", record.id);

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Deleted successfully";
      show = true;
      loading = false;
    }
  };
  const deleteRecord = async (id) => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("automations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      getRecord();
    } catch (error) {
      errors = error;
    } finally {
      modalDelete = false;
      loading = false;
    }
  };
</script>

<Loading {loading} />
<Toast bind:show {message} />

<div class="bg-white">
  <form
    on:submit={() => {
      updateRecord();
    }}
  >
    {#if records.length === 0}
      <div class="px-4 py-20 text-center border-b border-gray-200">
        <div class="">Send reminder automatically</div>
        <div class="flex justify-center text-brand-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
            class="w-5 h-5 mr-2"
            ><path fill="none" d="M0 0h24v24H0z" /><path
              d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z"
            /></svg
          >
          <div>Add a reminder now</div>
        </div>
      </div>
    {:else}
      <Accordion>
        {#each records as record, recordIndex}
          <AccordionItem
            title={`${recordIndex + 1}. ${record.name || "Click to edit"}`}
          >
            <div class="bg-gray-50 border-t border-gray-200 p-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <div class="mb-5">
                    <TextInput
                      labelText="Reminder Name"
                      bind:value={record.name}
                      class="mt-2"
                    />
                  </div>
                  <div class="flex mb-5">
                    <div class="flex-1">
                      <NumberInput label="After" bind:value={record.value} />
                    </div>
                    <div>
                      <Select bind:selected={record.unit} class="mt-4">
                        <SelectItem value="day" text="day" />
                        <SelectItem value="month" text="month" />
                        <SelectItem value="year" text="year" />
                      </Select>
                    </div>
                  </div>
                  <div class="mb-5">
                    <Select bind:selected={record.field} labelText="From">
                      {#each fields as field}
                        <SelectItem value={field.name} text={field.name} />
                      {/each}
                    </Select>
                  </div>
                </div>
                <div>
                  <div class="mb-5">
                    <MultiSelect
                      titleText="Send to"
                      label="Recipients"
                      bind:selectedIds={record.recipients}
                      items={userGroup}
                    />
                  </div>
                  <div class="mb-5">
                    <TextArea labelText="Message" bind:value={record.message} />
                  </div>
                </div>
              </div>
              <div>
                <Button
                  on:click={() => {
                    updateRecord(record);
                  }}>Save</Button
                >
                <Button
                  kind="ghost"
                  on:click={() => {
                    deleteId = record.id;
                    modalDelete = true;
                  }}>Delete</Button
                >
              </div>
            </div>
          </AccordionItem>
        {/each}
      </Accordion>
    {/if}
    <footer class="bg-gray-50 flex items-end">
      <div
        class={`p-4 flex-1 flex items-end ${
          records.length ? "" : "justify-center"
        }`}
      >
        <div>
          <Button
            kind="secondary"
            on:click={() => {
              addRecord();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              class="w-4 h-4"
              ><path fill="none" d="M0 0h24v24H0z" /><path
                d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"
              /></svg
            >
            <span class="hidden sm:block ml-2">Reminder</span>
          </Button>
        </div>
      </div>
      <!-- <div class={`p-4 ${records.length ? "block" : "hidden"}`}>
        <Button type="submit">Save</Button>
      </div> -->
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
  on:submit={() => deleteRecord(deleteId)}
>
  <p>Do you want to delete this record?</p>
</Modal>
