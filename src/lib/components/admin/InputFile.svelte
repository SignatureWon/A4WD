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

  let uploading = false;
  $: filePreview = value ? f.extension(value) : false;

  const removeFile = async () => {
    let updateFile = {};
    updateFile[name] = null;
    if (fetch?.table && fetch?.id) {
      await supabase.from(fetch.table).update(updateFile).eq("id", fetch.id);
    }
    if (bucket && value) {
      await supabase.storage.from(bucket).remove([value]);
    }

    value = null;
    filePreview = false;
  };

  const handleUpload = async (event) => {
    const files = event.detail;
    if (!files || files.length === 0) return;

    const file = files[0];
    uploading = true;

    const filename = `${uuidv4()}.${f.extension(file.name)}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filename, file);

    uploading = false;

    if (error) {
      alert(`File upload failed: ${error.message}`);
      return;
    }

    if (fetch?.table && fetch?.id) {
      let updateFile = {};
      updateFile[name] = filename;
      await supabase.from(fetch.table).update(updateFile).eq("id", fetch.id);
    }

    value = filename;
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
        href="{env.PUBLIC_URL}/storage/v1/object/public/{bucket}/{value}"
        target="_blank"
        rel="noreferrer"
        class="file-icon file-icon-xl"
        data-type={filePreview}
      />
    </div>
    <Button kind="tertiary" on:click={() => removeFile()}>Remove</Button>
  {:else}
    <FileUploader
      buttonLabel={uploading ? "Uploading..." : "Upload"}
      kind="tertiary"
      status={uploading ? "uploading" : "edit"}
      disabled={uploading}
      on:change={handleUpload}
    />
  {/if}
  <input type="hidden" {name} bind:value />
</div>
