<script>
  import { FileUploader } from "carbon-components-svelte";
  import { v4 as uuidv4 } from "uuid";
  import { f } from "$lib/file";
  import { TextInput } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";

  export let name = "";
  export let label = "";
  export let value = "";
  export let bucket = "";
  export let half = false;
  export let required = false;

  let filePreview = false;
  if (value) {
    filePreview = f.extension(value);
  }
</script>

<div class={half ? "" : "md:col-span-2"}>
  <div class="mb-2 text-sm tracking-wide text-gray-600 font-semibold">
    {label}
  </div>

  {#if filePreview}
    <div>
      <!-- svelte-ignore a11y-missing-content -->
      <a
        href="{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/{bucket}/{value}"
        target="_blank"
        rel="noreferrer"
        class="file-icon file-icon-xl"
        data-type={filePreview}
      />
    </div>
  {:else}
    <FileUploader
      name="fileUpload-{name}"
      buttonLabel={filePreview ? "Replace" : "Upload"}
      kind="tertiary"
      status="complete"
      class="[&>.bx--file-container]:hidden"
      {required}
      on:change={async (files) => {
        const file = files.detail[0];
        filePreview = f.extension(file.name);
        value = `${uuidv4()}.${filePreview}`;
      }}
    />
    <input type="hidden" name="fileName-{name}" bind:value />
    <input type="hidden" name="fileBucket-{name}" bind:value={bucket} />
    <input type="hidden" {name} bind:value />
  {/if}
</div>
