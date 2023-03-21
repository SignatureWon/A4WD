<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import Toast from "$lib/components/Toast.svelte";
  import {
    Button,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";

  export let ref = "id";
  let id = ref;

  if (ref === "id") {
    id = $page.params.id;
  }

  let fields = [];
  let type = "text";
  const fieldTypes = {
    text: {
      label: "Text",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M13 6v15h-2V6H5V4h14v2z"/></svg>`,
    },
    long: {
      label: "Long Text",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm0 7h12v2H3v-2zm0 7h18v2H3v-2z"/></svg>`,
    },
    number: {
      label: "Number",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M7.784 14l.42-4H4V8h4.415l.525-5h2.011l-.525 5h3.989l.525-5h2.011l-.525 5H20v2h-3.784l-.42 4H20v2h-4.415l-.525 5h-2.011l.525-5H9.585l-.525 5H7.049l.525-5H4v-2h3.784zm2.011 0h3.99l.42-4h-3.99l-.42 4z"/></svg>`,
    },
    date: {
      label: "Date",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zm-2 2H9v2H7V5H4v4h16V5h-3v2h-2V5zm5 6H4v8h16v-8z"/></svg>`,
    },
    time: {
      label: "Time",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-8h4v2h-6V7h2v5z"/></svg>`,
    },
    switch: {
      label: "Switch",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 7a5 5 0 1 0 0 10h8a5 5 0 0 0 0-10H8zm0-2h8a7 7 0 0 1 0 14H8A7 7 0 0 1 8 5zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`,
    },
    select: {
      label: "Select",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"/></svg>`,
    },
    multiple: {
      label: "Multiple Select",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M11.602 13.76l1.412 1.412 8.466-8.466 1.414 1.414-9.88 9.88-6.364-6.364 1.414-1.414 2.125 2.125 1.413 1.412zm.002-2.828l4.952-4.953 1.41 1.41-4.952 4.953-1.41-1.41zm-2.827 5.655L7.364 18 1 11.636l1.414-1.414 1.413 1.413-.001.001 4.951 4.951z"/></svg>`,
    },
    image: {
      label: "Image",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg>`,
    },
    file: {
      label: "File",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M14 13.5V8a4 4 0 1 0-8 0v5.5a6.5 6.5 0 1 0 13 0V4h2v9.5a8.5 8.5 0 1 1-17 0V8a6 6 0 1 1 12 0v5.5a3.5 3.5 0 0 1-7 0V8h2v5.5a1.5 1.5 0 0 0 3 0z"/></svg>`,
    },
  };
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
        .from("custom_fields")
        .select("fields")
        .eq("ref", id)
        .single();

      if (error) throw error;

      if (data) {
        fields = data.fields;
      }
    } catch (error) {
      if (error.code === "PGRST116") {
        addRecord();
      }
    } finally {
      loading = false;
    }
  };
  const addRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("custom_fields")
        .insert([{ fields: [], ref: id }])
        .select()
        .single();

      if (error) throw error;

      fields = data;
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }
  };
  const updateRecord = async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("custom_fields")
        .update({ fields: fields })
        .eq("ref", id);

      if (error) throw error;
    } catch (error) {
      errors = error;
    } finally {
      message = "Updated successfully";
      show = true;
      loading = false;
    }
  };

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
    {#if fields.length === 0}
      <div class="px-4 py-20 text-center border-b border-gray-200">
        <div class="">Gather the required info</div>
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
          <div>Add a field now</div>
        </div>
      </div>
    {:else}
      {#each fields as field, fieldIndex}
        <div class="md:flex p-4 border-b border-gray-200">
          <div class="flex-1">
            <div class="flex ">
              <div class="w-8 text-right pr-2 mt-2">
                {fieldIndex + 1}
              </div>
              <div
                class="mx-2 rounded w-8 h-8 p-2 bg-gray-100 mt-1"
                title={fieldTypes[field.type].label}
              >
                {@html fieldTypes[field.type].icon}
              </div>
              <div class="flex-1">
                <TextInput placeholder="Name" bind:value={field.name} />
                {#if field.type === "select" || field.type == "multiple"}
                  {#each field.options as option, optionIndex}
                    <div class="flex items-center mt-2">
                      <div class="mr-2 w-4 h-4 rounded-full bg-gray-100 border border-gray-300" />
                      <div class="flex-1">
                        <TextInput
                          placeholder="Option"
                          bind:value={option.name}
                        />
                      </div>
                      <div>
                        <Button
                        kind="ghost"
                        iconDescription="Delete"
                        on:click={() => {
                          field.options = [...remove(field.options, optionIndex)];
                        }}
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
                  <Button
                    kind="ghost"
                    class="text-sm mt-1"
                    on:click={() => {
                      field.options = [
                        ...field.options,
                        {
                          name: "",
                        },
                      ];
                    }}>Add option</Button
                  >
                {/if}
              </div>
            </div>
          </div>
          <div class="flex justify-end">
            <Button
              kind="ghost"
              iconDescription="Move up"
              disabled={fieldIndex === 0 ? true : false}
              on:click={() => {
                fields = [...move(fields, fieldIndex, fieldIndex - 1)];
              }}
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
              disabled={fieldIndex === fields.length - 1 ? true : false}
              on:click={() => {
                fields = [...move(fields, fieldIndex, fieldIndex + 1)];
              }}
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
                fields = [...remove(fields, fieldIndex)];
              }}
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
    <footer class="bg-gray-50 flex items-end">
      <div
        class={`px-4 pt-2 pb-4 flex-1 flex items-end ${
          fields.length ? "" : "justify-center"
        }`}
      >
        <div
          class="leading-10 h-10 text-sm font-medium tracking-wider text-gray-800 mr-2 hidden sm:block"
        >
          Type
        </div>
        <div>
          <Select bind:selected={type}>
            <SelectItem value="text" text="Text" />
            <SelectItem value="long" text="Long Text" />
            <SelectItem value="number" text="Number" />
            <SelectItem value="date" text="Date" />
            <SelectItem value="time" text="Time" />
            <SelectItem value="switch" text="Switch" />
            <SelectItem value="select" text="Select" />
            <SelectItem value="multiple" text="Multiple Select" />
            <SelectItem value="image" text="Image" />
            <SelectItem value="file" text="File" />
          </Select>
        </div>
        <div>
          <Button
            kind="secondary"
            on:click={() => {
              fields = [
                ...fields,
                {
                  type: type,
                  name: "",
                  options: [],
                },
              ];
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
            <span class="hidden sm:block ml-2">Field</span>
          </Button>
        </div>
      </div>
      <div class={`p-4 ${fields.length ? "block" : "hidden"}`}>
        <Button type="submit">Save</Button>
      </div>
    </footer>
  </form>
</div>
