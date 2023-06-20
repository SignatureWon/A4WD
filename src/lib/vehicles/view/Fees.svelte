<script>
  import { format } from "$lib/format.js";
  export let quote;
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Other Fees</h2>
  </div>
  <div class="p-4">
    {#if quote.details.one_way > 0}
      <div class="flex">
        <div class="flex-1">One-way fee</div>
        <div class="w-20 text-right">${format.currency(quote.details.one_way)}</div>
      </div>
    {/if}
    {#each quote.details.fees.items as item}
      <div class="flex">
        <div class="flex-1">{item.name}</div>
        <div class="w-20 text-right">${format.currency(item.fee)}</div>
      </div>
    {/each}
  </div>
</div>
