<script>
  import { format } from "$lib/format.js";
  import { q } from "$lib/quote.js";
  import { onMount } from "svelte";
  export let data;
  // export let search;

  let quote = {
    details: data
  }
  let summary = {
    agentItems: [],
    supplierItems: [],
    pickupItems: [],
    termsItems: [],
    totalAgent: 0,
    totalCommission: 0,
    totalSupplier: 0,
  };
  onMount(async () => {
    summary = q.getPayments(quote);
  });
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Payment Schedule</h2>
  </div>
  <div class="px-4">
    <div class="divide-y divide-gray-200">
      {#each summary.termsItems as item}
        <div class="py-3">
          <div class="flex">
            <div class="flex-1">{item.name}</div>
            <div class="text-right w-28 whitespace-nowrap">
              ${format.currency(item.total)}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
