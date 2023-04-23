<script>
  import { Button, Modal, NumberInput } from "carbon-components-svelte";

  const icon = {
    up: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z" /></svg>`,
    down: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M13 16.172l5.364-5.364 1.414 1.414L12 20l-7.778-7.778 1.414-1.414L11 16.172V4h2v12.172z" /></svg>`,
    delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="h-4 w-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path   d="M17 6h5v2h-2v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8H2V6h5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3zm1 2H6v12h12V8zm-9 3h2v6H9v-6zm4 0h2v6h-2v-6zM9 4v2h6V4H9z" /></svg>`,
  };

  export let value = [];
  if (!value) {
    value = [];
  }
  let jsonTiers = JSON.stringify(value);

  const addRecords = () => {
    if (!value) {
      value = [];
    }
    value = [
      ...value,
      {
        from: null,
        to: null,
      },
    ];
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

  let open = false;
</script>

<div>
  <Button
    on:click={() => {
      open = true;
    }}>Manage Tiers</Button
  >
  <input name="tiers" type="hidden" bind:value={jsonTiers} />
</div>
<Modal
  size="lg"
  bind:open
  hasScrollingContent
  primaryButtonText="Done"
  on:click:button--primary={() => {
    jsonTiers = JSON.stringify(value);
    open = false;
  }}
  secondaryButtonText="Add Tier"
  on:click:button--secondary={() => addRecords()}
  modalHeading="Manage Tiers"
>
  {#if value.length === 0}
    <div class="p-4 text-center bg-gray-100 mb-4">
      <div>No tiers yet</div>
    </div>
  {:else}
    <header class="flex text-sm tracking-wide font-bold text-gray-600">
      <div class="pr-4">
        <div class="w-8 h-8" />
      </div>
      <div class="flex-1">
        <div class="md:flex">
          <div class="md:flex-1">
            <div class="grid grid-cols-2 gap-2">
              <div>From (days)</div>
              <div>To (days)</div>
            </div>
          </div>
          <div class="w-28" />
        </div>
      </div>
    </header>
    {#each value as row, rowIndex}
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
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <NumberInput
                    min={2}
                    max={9999}
                    placeholder="From (days)"
                    bind:value={row.from}
                  />
                </div>
                <div>
                  <NumberInput
                    min={2}
                    max={9999}
                    placeholder="To (days)"
                    bind:value={row.to}
                  />
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
                    value = [...move(value, rowIndex, rowIndex - 1)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.up}
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Move down"
                  disabled={rowIndex === value.length - 1 ? true : false}
                  on:click={() => {
                    value = [...move(value, rowIndex, rowIndex + 1)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.down}
                </Button>
                <Button
                  kind="ghost"
                  iconDescription="Delete"
                  on:click={() => {
                    value = [...remove(value, rowIndex)];
                  }}
                  class="md:px-2"
                >
                  {@html icon.delete}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    {/each}
    <div class="text-center pb-4 text-sm text-gray-500">
      Enter 9999 for the last tier
    </div>
  {/if}
</Modal>
