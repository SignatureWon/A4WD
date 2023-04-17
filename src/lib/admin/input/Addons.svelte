<script>
  import {
    Button,
    InlineNotification,
    Modal,
    NumberInput,
    TextInput,
    TextArea,
    Toggle,
  } from "carbon-components-svelte";
  import { db } from "$lib/db";
  import { supabase } from "$lib/supabaseClient";

  //   export let key = "";
  //   export let field = {};
  export let data = {
    addons: [],
  };

  let open = false;

  const saveAddons = async () => {
    data.updated = false;
    await supabase
      .from("addons")
      .update({
        addons: data.addons,
      })
      .eq("id", data.id);

    open = false;
    data.updated = true;
  };

  const schema = {
    name: null,
    description: null,
    type: "Per Day",
    nett_rate: 0,
    gross_rate: 0,
    nett_cap: 0,
    gross_cap: 0,
    qty: 1,
    inclusive: false,
  };

  const addRecords = () => {
    if (!data.addons) {
      data.addons = [];
    }
    // let newRow = {};
    // for (const key in schema) {
    //   newRow[key] = null;
    // }
    data.addons = [...data.addons, schema];
  };
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

{#if data.id}
  <Button
    on:click={() => {
      open = true;
    }}
  >
    Manage Addons
  </Button>

  <Modal
    size="lg"
    bind:open
    hasScrollingContent
    modalHeading="Manage Addons"
    primaryButtonText="Save Addons"
    secondaryButtonText="Cancel"
    secondaryButtons={[{ text: "+ Addons" }, { text: "Cancel" }]}
    on:click:button--secondary={({ detail }) => {
      if (detail.text === "Cancel") {
        open = false;
      } else {
        addRecords();
      }
    }}
    on:submit={() => saveAddons()}
  >
    {#if !data.addons}
      <InlineNotification
        lowContrast
        hideCloseButton
        kind="warning"
        title=""
        subtitle="Please add a new addons"
        class="mx-auto"
      />
    {:else}
      {#each data.addons || [] as item, itemIndex}
        <div class="flex border-b border-gray-200 py-4">
          <div
            class="w-8 h-8 leading-8 text-center rounded bg-brand-600 text-white mr-2"
          >
            {itemIndex + 1}
          </div>
          <div class="flex-1">
            <div class="md:flex">
              <div class="md:flex-1">
                <TextInput placeholder="Name" bind:value={item.name} />
                <TextArea placeholder="Description" bind:value={item.description} class="mb-4" />
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <NumberInput
                      label="Nett Rate"
                      bind:value={item.nett_rate}
                      step={0.1}
                    />
                    <NumberInput
                      label="Nett Cap"
                      bind:value={item.nett_cap}
                      step={0.1}
                    />
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <NumberInput
                      label="Gross Rate"
                      bind:value={item.gross_rate}
                      step={0.1}
                    />
                    <NumberInput
                      label="Gross Cap"
                      bind:value={item.gross_cap}
                      step={0.1}
                    />
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-1 gap-4">
                    <NumberInput
                      label="Max Qty"
                      bind:value={item.qty}
                      step={1}
                    />

                    <Toggle
                      labelText="Inclusive"
                      bind:toggled={item.inclusive}
                    />
                  </div>
                </div>
              </div>
              <div class="flex justify-end ml-2">
                <div class="flex">
                  <Button
                    kind="ghost"
                    iconDescription="Move up"
                    disabled={itemIndex === 0 ? true : false}
                    on:click={() => {
                      data.addons = [
                        ...move(data.addons, itemIndex, itemIndex - 1),
                      ];
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
                    disabled={itemIndex === data.addons.length - 1
                      ? true
                      : false}
                    on:click={() => {
                      data.addons = [
                        ...move(data.addons, itemIndex, itemIndex + 1),
                      ];
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
                    on:click={() => {
                      data.addons = [...remove(data.addons, itemIndex)];
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
  </Modal>
{:else}
  <InlineNotification
    hideCloseButton
    lowContrast
    kind="warning"
    title="Not available: "
    subtitle="Will be enabled after added this record"
  />
{/if}
