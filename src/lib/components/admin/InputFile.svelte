<script>
  import { supabase } from "$lib/supabaseClient";
  import { Button, FileUploader } from "carbon-components-svelte";
  import { v4 as uuidv4 } from "uuid";
  import { f } from "$lib/file";
  import { env } from "$env/dynamic/public";

  export let name = "";
  export let label = "";
  export let value = "";
  export let bucket = "";
  export let fetch = {};

  let filePreview = false;
  if (value) {
    filePreview = f.extension(value);
  }

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
    <div>
      <!-- svelte-ignore a11y-missing-content -->
      <a
        href="{env.PUBLIC_DB_URL}/storage/v1/object/public/{bucket}/{value}"
        target="_blank"
        rel="noreferrer"
        class="file-icon file-icon-xl"
        data-type={filePreview}
      />
    </div>
    <Button kind="tertiary" on:click={() => removeFile()}>Remove</Button>
  {:else}
    <FileUploader
      name="fileUpload_{name}"
      buttonLabel="Upload"
      kind="tertiary"
      status="edit"
      on:change={async (files) => {
        const file = files.detail[0];
        value = `${uuidv4()}.${f.extension(file.name)}`;
      }}
    />
    <input type="hidden" name="fileName_{name}" bind:value />
    <input type="hidden" name="fileBucket_{name}" bind:value={bucket} />
    <input type="hidden" {name} bind:value />
  {/if}
</div>
