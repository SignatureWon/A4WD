<script>
  import { format } from "$lib/format.js";
  import { Button, Checkbox, NumberInput, TextInput, Toggle } from "carbon-components-svelte";
  export let quote;
  export let count;
  if (!quote.adjustments) {
    quote.adjustments = [];
  }

  const addAdjustment = () => {
    if (!quote.adjustments) {
      quote.adjustments = [];
    }
    quote.adjustments = [
      ...quote.adjustments,
      {
        name: "",
        own: false,
        value: 0,
      },
    ];
  };
  const delAdjustment = async (index) => {
    let newArr = quote.adjustments;
    newArr.splice(index, 1);
    quote.adjustments = [...newArr];
    count();
  };
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Adjustments</h2>
  </div>
  <div class="p-4">
    {#each quote.adjustments || [] as item, index}
      {#if index === 0}
        <div class="pb-3">
          <div class="flex">
            <div class="flex-1 text-sm text-gray-600 tracking-wide font-bold">Name</div>
            <div class="w-24 mx-2 text-sm text-gray-600 tracking-wide font-bold">Value</div>
            <div class="text-sm text-gray-600 tracking-wide font-bold w-6">A4</div>
            <div class="w-6">&nbsp;</div>
          </div>
        </div>
      {/if}
      <div class="mb-1">
        <div class="flex">
          <div class="flex-1"><TextInput bind:value={item.name} /></div>
          <div class="w-24 mx-2">
            <NumberInput hideSteppers bind:value={item.value} on:keyup={count} />
          </div>
          <div class="pt-1 w-6">
            <Checkbox bind:checked={item.own} on:check={count} />
            <!-- <Toggle labelText="A4" labelA="" labelB="" bind:toggled={item.own} /> -->
          </div>
          <div class="pt-1 w-6">
            <Button
              kind="danger-ghost"
              size="small"
              class="!px-1 h-6"
              on:click={() => {
                delAdjustment(index);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"
                ><path
                  d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"
                /></svg
              >
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <div class="p-3 bg-gray-50 text-gray-400 text-center">No adjustments</div>
    {/each}
    <div class="py-2">
      <Button kind="tertiary" class="text-sm py-0.5 h-6" on:click={addAdjustment}>Add Adjustment</Button>
    </div>
  </div>
</div>
