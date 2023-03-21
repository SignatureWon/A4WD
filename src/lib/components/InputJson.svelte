<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  import {
    Button,
    DatePicker,
    DatePickerInput,
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
  import InputDateRange from "./input/InputDateRange.svelte";
  import InputHidden from "./input/InputHidden.svelte";
  import InputSwitch from "./input/InputSwitch.svelte";
  import InputTextarea from "./input/InputTextarea.svelte";
  import InputSelect from "./input/InputSelect.svelte";
  import InputNumber from "./input/InputNumber.svelte";
  import InputRelated from "./input/InputRelated.svelte";
  import InputFile from "./input/InputFile.svelte";

  export let table = "table";
  export let field = "field";
  export let update = 1;
  export let structure = [
    {
      name: "Name",
      type: "text",
    },
  ];

  const id = $page.params.id;

  let records = [];
  let related = {};
  structure.forEach((item) => {
    if (item.type === "related") {
      related[item.related] = {};
    }
  });

  let loading = false;
  let show = false;
  let message = "";
  let errors = {};

  onMount(() => {
    getRecord();
  });

  const getRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .select(field)
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        records = data[field];
      }
    } catch (error) {
      console.log(error);
    } finally {
      loading = false;
    }
  };
  const updateRecord = async (record) => {
    try {
      let obj = {};
      obj[field] = records;
      loading = true;
      const { data, error } = await supabase
        .from(table)
        .update(obj)
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
  const getRelated = async (related_table) => {
    if (related[related_table].length > 0) {
      return related[related_table];
    } else {
      try {
        loading = true;
        const { data, error } = await supabase.from(related_table).select();

        if (data) {
          related[related_table] = data;
        }

        if (error) throw error;
      } catch (error) {
        errors = handleError(error);
      } finally {
        loading = false;
        // console.log(related[related_table]);
        return related[related_table];
      }
    }
  };

  function newItem() {
    let item = {};
    structure.forEach((field) => {
      if (field.type === "related") {
        item[field.name] = {
          id: null,
          code: null,
          name: null,
        };
      } else if (field.type === "number") {
        item[field.name] = field.default || 0;
      } else {
        item[field.name] = null;
      }
    });
    return item;
  }
  function move(arr, from, to) {
    let newArr = arr;
    let el = newArr.splice(from, 1)[0];
    newArr.splice(to, 0, el);
    return newArr;
  }
  function remove(arr, index) {
    let newArr = arr;
    newArr.splice(index, 1);
    return newArr;
  }
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
        <div class="pb-4">No records yet</div>
      </div>
    {:else}
      {#each records as record, recordIndex}
        <div class="md:flex p-4 border-b border-gray-200">
          <div class="flex-1">
            <div class="flex ">
              <div class="mr-1 mt-1">
                <div
                  class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white"
                >
                  {recordIndex + 1}
                </div>
              </div>
              <div class="flex-1 grid grid-cols-2 gap-4">
                {#each structure as field}
                  <div
                    class={field.size === "half" ? "col-span-1" : "col-span-2"}
                  >
                    {#if field.type === "textarea"}
                      <InputTextarea {field} bind:record />
                    {:else if field.type === "number"}
                      <InputNumber {field} bind:record />
                    {:else if field.type === "related"}
                      <Select
                        labelText={field.label}
                        name={field.name}
                        selected={record[field.name].id}
                        required={field.required || false}
                        on:change={(e) => {
                          if (field.related === "depots") {
                            let selected = related[field.related].filter(
                              function (record) {
                                return record.id === e.target.value;
                              }
                            )[0];

                            record[field.name] = {
                              id: selected.id,
                              code: selected.code,
                              label: selected.name,
                            };
                          } else {
                            record[field.name] = e.target.value;
                          }
                        }}
                      >
                        <SelectItem value="" text="Select {field.name}" />
                        {#await getRelated(field.related) then related}
                          {#each related as option}
                            <SelectItem value={option.id} text={option.name} />
                          {/each}
                        {/await}
                      </Select>
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
                    {:else}
                      <InputText {field} bind:record />
                    {/if}
                    <!-- {#if field.type === "textarea"}
                      <TextArea
                        placeholder={field.name}
                        bind:value={item[field.name]}
                      />
                    {:else if field.type === "related"}
                      <Select
                        labelText={field.label}
                        name={field.name}
                        selected={item[field.name].id}
                        required={field.required || false}
                        on:change={(e) => {
                          if (field.related === "depots") {
                            let selected = related[field.related].filter(
                              function (item) {
                                return item.id === e.target.value;
                              }
                            )[0];

                            item[field.name] = {
                              id: selected.id,
                              code: selected.code,
                              label: selected.name,
                            };
                          } else {
                            item[field.name] = e.target.value;
                          }
                        }}
                      >
                        <SelectItem value="" text="Select {field.name}" />
                        {#await getRelated(field.related) then related}
                          {#each related as option}
                            <SelectItem value={option.id} text={option.name} />
                          {/each}
                        {/await}
                      </Select>
                    {:else if field.type === "select"}
                      <Select
                        noLabel
                        name={field.name}
                        bind:selected={item[field.name]}
                        required={field.required || false}
                      >
                        <SelectItem value="" text="Select {field.name}" />
                        {#each field.options as option}
                          <SelectItem value={option.id} text={option.name} />
                        {/each}
                      </Select>
                    {:else if field.type === "number"}
                      <NumberInput
                        label={field.name}
                        bind:value={item[field.name]}
                        step={field.step || 1}
                      />
                    {:else if field.type === "daterange"}
                      <DatePicker
                        datePickerType="range"
                        dateFormat="d/m/Y"
                        on:change={(e) => {
                          item[field.name] = dayjs(e.detail.selectedDates[0]);
                          item[field.name2] = dayjs(e.detail.selectedDates[1]);
                        }}
                        valueFrom={item[field.name]
                          ? dayjs(item[field.name]).format("DD/MM/YY")
                          : dayjs().format("DD/MM/YY")}
                        valueTo={item[field.name2]
                          ? dayjs(item[field.name2]).format("DD/MM/YY")
                          : dayjs().format("DD/MM/YY")}
                      >
                        <DatePickerInput
                          labelText={field.label}
                          name={field.name}
                          placeholder="dd/mm/yyyy"
                        />
                        <DatePickerInput
                          labelText={field.label2}
                          name={field.name2}
                          placeholder="dd/mm/yyyy"
                        />
                      </DatePicker>
                    {:else if field.type === "switch"}
                      <Toggle
                        labelText={field.name}
                        bind:toggled={item[field.name]}
                      />
                    {:else}
                      <TextInput
                        placeholder={field.name}
                        bind:value={item[field.name]}
                      />
                    {/if} -->
                  </div>
                {/each}
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <Button
              kind="ghost"
              iconDescription="Move up"
              disabled={recordIndex === 0 ? true : false}
              on:click={() => {
                records = [...move(records, recordIndex, recordIndex - 1)];
              }}
              class="md:px-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="h-4 w-4"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z"
                /></svg
              >
            </Button>
            <Button
              kind="ghost"
              iconDescription="Move down"
              disabled={recordIndex === records.length - 1 ? true : false}
              on:click={() => {
                records = [...move(records, recordIndex, recordIndex + 1)];
              }}
              class="md:px-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="h-4 w-4"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z"
                /></svg
              >
            </Button>
            <Button
              kind="ghost"
              iconDescription="Delete"
              on:click={() => {
                records = [...remove(records, recordIndex)];
              }}
              class="md:px-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="h-4 w-4"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
                /></svg
              >
            </Button>
          </div>
        </div>
      {/each}
    {/if}
    <footer class="p-5 bg-gray-50 flex items-center justify-between">
      <div>
        <Button
          class="flex"
          kind="secondary"
          on:click={() => {
            records = [...records, newItem()];
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
          <span class="hidden sm:block ml-2">New</span>
        </Button>
      </div>
      <div>
        <Button type="submit">Save</Button>
      </div>
    </footer>
  </form>
</div>
