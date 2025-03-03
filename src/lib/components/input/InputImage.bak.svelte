<script>
  import { FileUploader } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import { supabase } from "$lib/supabaseClient";

  export let id = "add";
  export let field = {};
  export let record = {};
  export let updateRecord = () => {};
</script>

{#if id !== "add"}
  <label for={field.name} class="block mb-2 text-sm tracking-wider text-gray-600 font-semibold">{field.label}</label>
  {#if record[field.name] !== null || record[field.name] !== ""}
    <div class="mb-2">
      <img src={`${env.PUBLIC_DB_URL}/storage/v1/object/public/${field.bucket}/${record[field.name] || ""}`} alt="" />
    </div>
  {/if}
  <div>
    <FileUploader
      labelTitle=""
      buttonLabel={record[field.name] === null || record[field.name] === "" ? "Upload" : "Change"}
      labelDescription=""
      accept={["*.jpg", "*.png", "*.gif"]}
      kind="secondary"
      status="complete"
      class="[&>.bx--file-container]:hidden"
      on:change={async (files) => {
        const filename = `${record.id}.png`;
        if (record[field.name] === null || record[field.name] === "") {
          const { data, error } = await supabase.storage.from(field.bucket).upload(filename, files.detail[0]);
        } else {
          const { data, error } = await supabase.storage.from(field.bucket).update(filename, files.detail[0]);
        }

        record[field.name] = `${filename}?c=${Date.now()}`;

        updateRecord();
      }}
    />
  </div>
{/if}
