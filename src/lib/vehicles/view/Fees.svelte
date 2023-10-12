<script>
  import { format } from "$lib/format.js";
  export let quote;

  let waive = quote.details.routes?.waive || false;
  console.log("waive", quote.details);
  let waive_days = quote.details.routes?.waive_days || 0;
  let duration = quote.details.duration;

  const haveOneWay = () => {
    console.log("f", waive);
    if (waive) {
      if (duration > waive_days) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  $:haveOneWay()
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Other Fees</h2>
  </div>
  <div class="p-4">
    {#if haveOneWay}
      {#if quote.details.one_way > 0}
        <div class="flex">
          <div class="flex-1">One-way fee</div>
          <div class="w-20 text-right">${format.currency(quote.details.one_way)}</div>
        </div>
      {/if}
    {/if}
    {#each quote.details.fees.items as item}
      <div class="flex">
        <div class="flex-1">{item.name}</div>
        <div class="w-20 text-right">${format.currency(item.fee)}</div>
      </div>
    {/each}
    {#if quote.details.one_way === 0 && quote.details.fees.items.length === 0}
      <div class="p-3 bg-gray-50 text-gray-400 text-center">No fees</div>
    {/if}
  </div>
</div>
