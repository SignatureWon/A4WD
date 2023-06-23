<script>
  import { format } from "$lib/format.js";
  export let quote;
  console.log(quote);
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Specials</h2>
  </div>
  <div class="p-4">
    {#if quote.details.specials.total > 0}
      {#each quote.details.specials.items as item}
        {#if item.discount_amount > 0}
          <div class="border-b border-gray-200 py-3">
            <div class="flex mb-2">
              <div class="flex-1">{item.name}</div>
              <div class="text-right">
                -${format.currency(item.discount_amount)}
              </div>
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      <div class="p-3 bg-gray-50 text-gray-400 text-center">No specials</div>
    {/if}
  </div>
</div>
