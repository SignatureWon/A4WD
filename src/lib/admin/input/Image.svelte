<script>
  import { FileUploader, InlineNotification } from "carbon-components-svelte";
  import { img } from "$lib/img";
  import { db } from "$lib/db";
  import { env } from "$env/dynamic/public";

  export let key = "";
  export let field = {};
  export let data = {};
  export let fetch = false;
</script>

<label for={key} class="block mb-2 text-sm tracking-wider text-gray-600 font-semibold">{field.label}</label>
{#if data[key]}
  <div class="mb-2">
    <img
      src={`${env.PUBLIC_DB_URL}/storage/v1/object/public/${field.options}/${data[key] || ""}`}
      alt=""
      class="w-auto h-24"
    />
  </div>
{/if}
{#if data["name"]}
  <div>
    <FileUploader
      labelTitle=""
      buttonLabel={data[key] === null ? "Upload" : "Change"}
      labelDescription=""
      accept={["*.jpg", "*.png", "*.gif"]}
      kind="secondary"
      status="complete"
      class="[&>.bx--file-container]:hidden"
      on:change={async (files) => {
        const file = files.detail[0];
        const filename = img.name(file);

        if (data[key] !== null) {
          await img.remove(data[key], "contents");
        }

        await img.upload(file, filename, "contents", 800, 600);
        await img.upload(file, `thumb-${filename}`, "contents", 400, 300);

        setTimeout(async () => {
          data[key] = filename;
          await db.update(fetch, data);
        }, 500);
      }}
    />
  </div>
{:else}
  <InlineNotification
    hideCloseButton
    lowContrast
    kind="warning"
    title="Upload:"
    subtitle="Please create the record first"
  />
{/if}
