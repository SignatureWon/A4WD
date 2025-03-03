<script>
  import { FileUploader } from "carbon-components-svelte";
  import { v4 as uuidv4 } from "uuid";
  import { env } from "$env/dynamic/public";
  import { supabase } from "$lib/supabaseClient";

  export let field = {};
  export let record = {};
  export let updateRecord = () => {};

  function getExtension(filename) {
    const lastDot = filename.lastIndexOf(".");
    const ext = filename.substring(lastDot + 1);
    return ext;
  }
</script>

<label for={field.name} class="block mb-2 text-sm tracking-wider text-gray-600 font-semibold">{field.label}</label>
{#if record[field.name]}
  <div class="mb-2">
    <!-- svelte-ignore a11y-missing-content -->
    <a
      href={`${env.PUBLIC_DB_URL}/storage/v1/object/public/${field.bucket}/${record[field.name] || ""}`}
      target="_blank"
      rel="noreferrer"
      class="file-icon file-icon-xl"
      data-type={getExtension(record[field.name])}
    />
  </div>
{/if}
<div>
  <FileUploader
    labelTitle=""
    buttonLabel={record[field.name] === null || record[field.name] === "" ? "Upload" : "Change"}
    labelDescription=""
    kind="secondary"
    status="complete"
    class="[&>.bx--file-container]:hidden"
    on:change={async (files) => {
      const file = files.detail[0];

      let filename = files.detail[0].name;
      const lastDot = filename.lastIndexOf(".");
      const ext = filename.substring(lastDot + 1);
      filename = `${uuidv4()}.${ext}`;

      if (record[field.name] !== null || record[field.name] !== "") {
        const { data, error } = await supabase.storage
          .from(field.bucket)
          .remove([record[field.name], `thumb-${record[field.name]}`]);
      }
      const { data, error } = await supabase.storage.from(field.bucket).upload(filename, files.detail[0]);

      record[field.name] = filename;

      updateRecord();
    }}
  />
</div>
