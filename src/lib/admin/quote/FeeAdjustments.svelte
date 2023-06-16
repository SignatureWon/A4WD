<script>
  import { format } from "$lib/format.js";
  import { Button, Checkbox, NumberInput, TextInput, Toggle } from "carbon-components-svelte";
  export let adjustments;
  export let count;
  if (!adjustments) {
      adjustments = [];
    }

  const addAdjustment = () => {
    if (!adjustments) {
      adjustments = [];
    }
    adjustments = [
      ...adjustments,
      {
        name: "",
        own: false,
        value: 0,
      },
    ];
  };
</script>

{#each adjustments || [] as item, index}
  {#if index === 0}
    <div class="py-3">
      <div class="flex">
        <div class="flex-1 text-sm text-gray-600 tracking-wide font-bold">Name</div>
        <div class="w-24 mx-2 text-sm text-gray-600 tracking-wide font-bold">Value</div>
        <div class="text-sm text-gray-600 tracking-wide font-bold w-6">A4</div>
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
    </div>
  </div>
{:else}
  <div class="p-4 border border-gray-200 text-center">No adjustments</div>
{/each}
<div class="py-2">
  <Button kind="tertiary" class="text-sm py-0.5 h-6" on:click={addAdjustment}>Add Adjustment</Button>
</div>
