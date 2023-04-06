<script>
  import { img } from "$lib/img";
  import { db } from "$lib/db";
  import { env } from "$env/dynamic/public";
  import { Button, FileUploader, TextInput } from "carbon-components-svelte";

  export let key = "";
  //   export let field = {};
  export let data = {};
  export let fetch = false;

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

<div class="bg-white">
  {#if data[key].length === 0}
    <div class="px-4 py-20 text-center">
      <div class="pb-4">No records yet</div>
    </div>
  {:else}
    {#each data[key] as row, rowIndex}
      <div class="flex pb-4 mb-4 border-b border-gray-200">
        <div class="pr-4">
          <div
            class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white"
          >
            {rowIndex + 1}
          </div>
        </div>
        <div class="flex-1">
          <div class="md:flex">
            <div class="md:flex-1">
              <div class="md:flex">
                <div class="w-40 pr-2">
                  <img src={row.thumb} alt={row.caption} />
                </div>
                <div class="md:flex-1">
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
                    data[key] = [...move(data[key], rowIndex, rowIndex - 1)];
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
                  disabled={rowIndex === data[key].length - 1 ? true : false}
                  on:click={() => {
                    data[key] = [...move(data[key], rowIndex, rowIndex + 1)];
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
                  on:click={async () => {
                    await img.remove(row.name, "gallery");
                    data[key] = [...remove(data[key], rowIndex)];
                    await db.update(fetch, data);
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
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <div>
    <FileUploader
      labelTitle=""
      buttonLabel="Add record"
      labelDescription=""
      accept={[".jpg", ".jpeg", ".png", ".gif"]}
      kind="tertiary"
      status="complete"
      class="[&>.bx--file-container]:hidden [&>.bx--btn]:mx-auto"
      on:change={async (files) => {
        const file = files.detail[0];
        const filename = img.name(file);

        await img.upload(file, filename, "gallery", 800, 600);
        await img.upload(file, `thumb-${filename}`, "gallery", 400, 300);

        setTimeout(async () => {
          data[key] = [
            ...data[key],
            {
              name: filename,
              url: `${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${filename}`,
              thumb: `${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/thumb-${filename}`,
              caption: "",
            },
          ];
          await db.update(fetch, data);
        }, 500);
      }}
    />
  </div>
</div>
