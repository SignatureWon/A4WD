<script>
  import { db } from "$lib/db";
  import { goto } from "$app/navigation";

  import Text from "./Text.svelte";
  import TextArea from "./TextArea.svelte";
  import Number from "./Number.svelte";
  import Related from "./Related.svelte";
  import Select from "./Select.svelte";
  import Switch from "./Switch.svelte";
  import Image from "./Image.svelte";
  import File from "./File.svelte";
  import RichText from "./RichText.svelte";
  import Link from "./Link.svelte";
  import DateRange from "./DateRange.svelte";
  import Json from "./Json.svelte";
  import Seasonal from "./Seasonal.svelte";
  import Gallery from "./Gallery.svelte";
  import Hidden from "./Hidden.svelte";
  import { Button, Modal } from "carbon-components-svelte";

  export let structure = false;
  export let schema = false;
  export let fetch = false;
  export let data = false;
  export let duplicate = false;

  let modalDelete = false;
  let modalDuplicate = false;

  const handleSubmit = async () => {
    if (fetch.id === "add") {
      data = await db.insert(fetch, data);
      if (!data.error) {
        setTimeout(() => {
          goto(`${fetch.parent}/${data.id}`);
        }, 500);
      }
    } else {
      data = await db.update(fetch, data);
    }
  };

  const handleDelete = async () => {
    data = await db.delete(fetch, data);
    modalDelete = false;
    if (!data.error) {
      setTimeout(() => {
        goto(fetch.parent);
      }, 500);
    }
  };
  const handleDuplicate = async () => {
    data = await db.duplicate(fetch, data);
    modalDuplicate = false;
    if (!data.error) {
      goto(`${fetch.parent}/${data.id}`);
    }
  };
</script>

<form class="bg-white" on:submit={() => handleSubmit()}>
  {#if structure}
    {#if structure.name !== ""}
      <h3 class="font-medium text-lg p-4 border-b border-gray-200 bg-gray-50">
        {structure.name}
      </h3>
    {/if}
    {#each structure.sections as section}
      <div
        class="grid grid-cols-1 md:grid-cols-3 gap-5 px-5 py-8 border-b border-gray-200"
      >
        {#if section.name !== ""}
          <div>
            <h4 class="font-bold">
              {section.name}
            </h4>
          </div>
        {/if}
        <div class={section.name !== "" ? "md:col-span-2" : "md:col-span-3"}>
          <div class="grid grid-cols-2 gap-4">
            {#each section.fields as key}
              <div class={schema[key].half ? "col-span-1" : "col-span-2"}>
                {#if schema[key].type === "textarea"}
                  <TextArea {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "number"}
                  <Number {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "related"}
                  <Related {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "select"}
                  <Select {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "daterange"}
                  <DateRange {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "switch"}
                  <Switch {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "image"}
                  <Image {key} {fetch} field={schema[key]} bind:data />
                {:else if schema[key].type === "file"}
                  <File {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "richtext"}
                  <RichText {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "link"}
                  <Link {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "json"}
                  <Json {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "seasonal"}
                  <Seasonal {key} field={schema[key]} bind:data />
                {:else if schema[key].type === "gallery"}
                  <Gallery {key} {fetch} bind:data />
                {:else if schema[key].type === "hidden"}
                  <Hidden {key} bind:data />
                {:else}
                  <Text {key} field={schema[key]} bind:data />
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <footer class="flex p-4 bg-gray-50">
    <div class="flex-1">
      <div class="flex">
        {#if fetch.id !== "add"}
          <Button kind="danger-tertiary" on:click={() => (modalDelete = true)}>
            <span class="hidden md:inline-block">Delete</span>
            <span class="inline-block md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="w-5 h-5"
                fill="currentColor"
                ><path fill="none" d="M0 0h24v24H0z" /><path
                  d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z"
                /></svg
              >
            </span>
          </Button>
          {#if duplicate}
            <Button kind="ghost" on:click={() => (modalDuplicate = true)}>
              <span class="hidden md:inline-block">Duplicate</span>
              <span class="inline-block md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="w-5 h-5"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1H7zM5.002 8L5 20h10V8H5.002zM9 6h8v10h2V4H9v2zm-2 5h6v2H7v-2zm0 4h6v2H7v-2z"
                  /></svg
                >
              </span>
            </Button>
          {/if}
        {/if}
      </div>
    </div>
    <div class="mx-1">
      <Button kind="ghost" on:click={() => goto(fetch.parent)}>Back</Button>
    </div>
    <div>
      <Button type="submit">
        {fetch.id === "add" ? "Create" : "Update"}
      </Button>
    </div>
  </footer>
</form>
<Modal
  size="xs"
  bind:open={modalDelete}
  modalHeading="Delete record"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (modalDelete = false)}
  on:submit={() => handleDelete()}
>
  <p>Do you want to delete this record?</p>
</Modal>
<Modal
  size="xs"
  bind:open={modalDuplicate}
  modalHeading="Duplicate record"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (modalDuplicate = false)}
  on:submit={() => handleDuplicate()}
>
  <p>Do you want to duplicate this record?</p>
</Modal>
