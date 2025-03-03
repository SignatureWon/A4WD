<script>
  import { Button, FileUploader, TextInput } from "carbon-components-svelte";
  import { supabase } from "$lib/supabaseClient";
  import { env } from "$env/dynamic/public";
  import { v4 as uuidv4 } from "uuid";
  import { f } from "$lib/file";

  export let name = "";
  export let value = "";
  export let label = "";

  const icon = {
    up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z" /></svg>`,
    down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z" /></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" /></svg>`,
  };

  //   const addRecords = () => {
  //     if (!value) {
  //       value = [];
  //     }
  //     value = [...value, { ...schema }];
  //   };
  const move = (arr, from, to) => {
    let newArr = arr;
    let el = newArr.splice(from, 1)[0];
    newArr.splice(to, 0, el);
    return newArr;
  };
  const remove = (arr, index) => {
    let newArr = arr;
    newArr.splice(index, 1);
    return newArr;
  };
</script>

<div class="md:col-span-2">
  {#if label !== ""}
    <div class="text-sm font-semibold tracking-wide text-gray-600 mb-2">
      {label}
    </div>
  {/if}
  {#if !value}
    <div class="p-4 text-center bg-gray-100 mb-4">
      <div>No records yet</div>
    </div>
  {:else}
    {#each value as row, rowIndex}
      <div class="flex pb-4 mb-4 border-b border-gray-200">
        <div class="pr-4">
          <div class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white">
            {rowIndex + 1}
          </div>
        </div>
        <div class="flex-1">
          <div class="md:flex">
            <div class="md:flex-1">
              <div class="sm:flex">
                <div class="sm:w-40 sm:pr-2">
                  <img src={row.thumb} alt="" class="w-full" />
                </div>
                <div class="sm:flex-1">
                  <TextInput placeholder="Caption" bind:value={row.caption} />
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <div class="flex">
                <Button
                  kind="ghost"
                  iconDescription="Move up"
                  disabled={rowIndex === 0 ? true : false}
                  on:click={() => {
                    value = [...move(value, rowIndex, rowIndex - 1)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.up}
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Move down"
                  disabled={rowIndex === value.length - 1 ? true : false}
                  on:click={() => {
                    value = [...move(value, rowIndex, rowIndex + 1)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.down}
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Delete"
                  on:click={() => {
                    value = [...remove(value, rowIndex)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.delete}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <div class="text-center">
    <FileUploader
      labelTitle=""
      buttonLabel="Add record"
      labelDescription=""
      accept={[".jpg", ".jpeg", ".png", ".gif"]}
      kind="tertiary"
      status="complete"
      class="text-sm [&>.bx--btn]:h-8 [&>.bx--btn]:leading-8 [&>.bx--btn]:py-0 [&>.bx--file-container]:hidden [&>.bx--btn]:mx-auto"
      on:change={async (files) => {
        const file = files.detail[0];
        const filename = `${uuidv4()}.${f.extension(file.name)}`;
        await supabase.storage.from("gallery").upload(filename, file);

        if (!value) {
          value = [];
        }
        value = [
          ...value,
          {
            name: filename,
            url: `${env.PUBLIC_DB_URL}/storage/v1/render/image/public/gallery/${filename}?width=1200&height=1200&resize=contain`,
            thumb: `${env.PUBLIC_DB_URL}/storage/v1/render/image/public/gallery/${filename}?width=400&height=400&resize=contain`,
            caption: "",
          },
        ];
      }}
    />
  </div>
  <input {name} type="hidden" value={JSON.stringify(value)} />
</div>
