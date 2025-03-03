<script>
  import { supabase } from "$lib/supabaseClient";
  import { Button, FileUploader } from "carbon-components-svelte";
  import { v4 as uuidv4 } from "uuid";
  import { f } from "$lib/file";
  import { env } from "$env/dynamic/public";
  //   import { img } from "$lib/img";

  export let name = "";
  export let label = "";
  export let value = "";
  export let bucket = "";
  export let fetch = {};

  let filePreview = false;
  if (value) {
    filePreview = value;
  }

  let uploadImage = "";
  let uploadThumb = "";

  const removeFile = async () => {
    let updateFile = {};
    updateFile[name] = null;
    await supabase.from(fetch.table).update(updateFile).eq("id", fetch.id);
    await supabase.storage.from(bucket).remove([value]);

    value = null;
    filePreview = false;
  };
</script>

<div class="md:col-span-2">
  <div class="mb-2 text-sm tracking-wide text-gray-600 font-semibold">
    {label}
  </div>

  {#if filePreview}
    <div class="mb-2">
      <a href="{env.PUBLIC_URL}/storage/v1/object/public/{bucket}/{value}" target="_blank" rel="noreferrer"
        ><img
          src="{env.PUBLIC_URL}/storage/v1/render/image/public/{bucket}/{value}?width=150&height=150&resize=contain"
          alt=""
        /></a
      >
    </div>
    <Button kind="tertiary" on:click={() => removeFile()}>Remove</Button>
  {:else}
    <FileUploader
      name="imageUpload_{name}"
      buttonLabel="Upload"
      accept={["*.jpg", "*.png", "*.gif"]}
      kind="tertiary"
      status="edit"
      on:change={async (files) => {
        const file = files.detail[0];
        value = `${uuidv4()}.${f.extension(file.name)}`;

        // uploadImage = await img.resize(file, 800, 600);
        // uploadThumb = await img.resize(file, 400, 300);
      }}
    />
    <!-- <input
      type="hidden"
      name="imageUpload_{name}"
      value={uploadImage}
    />
    <input
      type="hidden"
      name="imageThumb_{name}"
      value={uploadThumb}
    /> -->
    <input type="hidden" name="imageName_{name}" bind:value />
    <input type="hidden" name="imageBucket_{name}" bind:value={bucket} />
    <input type="hidden" {name} bind:value />
  {/if}
</div>
