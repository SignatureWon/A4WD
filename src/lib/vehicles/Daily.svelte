<script>
  import { format } from "$lib/format.js";
  import { q } from "$lib/quote.js";
  import { onMount } from "svelte";
  export let quote;

  let list = []

  onMount(() => {
    list = q.getDailyRates(quote)
    console.log(list);
  })
  let editRow = [];
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Daily Basic Rental</h2>
  </div>
  <div class="p-4">
    {#each list as item, index}
      <div class="border-b border-gray-200 pb-3 mb-3">
        <div class="flex">
          <div class="flex-1">
            {item.name}
            <div class="text-gray-400 text-sm">
                Nett: {format.currency(item.nett)}<br>
                Commission: 
            </div>
          </div>
          <div class="text-right w-20">
            {format.currency(item.total)}
            <div class="text-gray-400 text-sm">
                {format.currency(item.nett)}<br>
                {format.currency(item.profit)}
            </div>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
