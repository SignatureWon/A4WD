<script>
  import { format } from "$lib/format.js";
  import { Toggle } from "carbon-components-svelte";

  export let quote;
  export let summary;
  export let count;

  // console.log(quote);
  // console.log(summary);
</script>

<div class="bg-brand-50 border border-brand-500 rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Summary</h2>
  </div>
  <div class="px-2">
    {#each summary.agentItems as item}
      {#if item.name === "Credit card surcharge (2%)"}
        <div class="flex py-2 px-2 border-b border-gray-200">
          <div class="flex-1 relative">
            <Toggle
              labelA=""
              labelB=""
              size="sm"
              bind:toggled={quote.cc_charge}
              on:toggle={count}
              class="absolute -mt-1.5"
            />
            <div class="pl-10">{@html item.name}</div>
          </div>
          <div class="text-right ml-4">{format.currency(item.total)}</div>
        </div>
      {:else if item.name === "Credit card surcharge (WAIVED)"}
        <div class="flex py-2 px-2 border-b border-gray-200">
          <div class="flex-1 relative">
            <Toggle
              labelA=""
              labelB=""
              size="sm"
              bind:toggled={quote.cc_charge}
              on:toggle={count}
              class="absolute -mt-1.5"
            />
            <div class="pl-10">{@html item.name}</div>
          </div>
          <div class="text-right ml-4">{format.currency(item.total)}</div>
        </div>
      {:else}
        <div class="flex py-2 px-2 border-b border-gray-200">
          <div class="flex-1">
            {@html item.name}
          </div>
          <div class="text-right ml-4">{format.currency(item.total)}</div>
        </div>
      {/if}
    {/each}

    <div class="flex py-2 px-2 border-b border-gray-200 font-bold bg-brand-200">
      <div class="flex-1">Total payable to agent</div>
      <div class="text-right ml-4">{format.currency(summary.totalAgent)}</div>
    </div>
    {#each summary.supplierItems as item}
      <div class="flex py-2 px-2 border-b border-gray-200">
        <div class="flex-1">
          {@html item.name}
        </div>
        <div class="text-right ml-4">{format.currency(item.total)}</div>
      </div>
    {/each}
    <div class="flex py-2 px-2 border-b border-gray-200 font-bold bg-brand-200">
      <div class="flex-1">Total payable to supplier</div>
      <div class="text-right ml-4">{format.currency(summary.totalSupplier)}</div>
    </div>
    <div class="flex py-2 px-2 border-b border-gray-200">
      <div class="flex-1">Total Nett</div>
      <div class="text-right ml-4">{format.currency(quote.nett)}</div>
    </div>
    <div class="flex py-2 px-2 border-b border-gray-200">
      <div class="flex-1">Total Profit</div>
      <div class="text-right ml-4">{format.currency(quote.profit)}</div>
    </div>
  </div>
</div>
