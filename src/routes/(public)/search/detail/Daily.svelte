<script>
  import { format } from "$lib/format.js";
  import { calculator } from "$lib/calculator.js";
  export let data;
  const list = calculator.group_rates(data);
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Daily Basic Rental</h2>
  </div>
  <div class="px-4">
    <div class="divide-y divide-gray-200">
      {#each list as item, index}
        <div class="py-3">
          <div class="flex">
            <div class="flex-1">
              {item.name}
              <!-- {`Daily basic rental: ${item.flex ? `Week ${item.week}: Flex[${item.flex}]: ` : `${item.rates_name}`} $${format.currency(
                item.daily.gross
              )} x ${item.days} days`} -->
            </div>
            <div class="text-right w-28">
              ${format.currency(item.total)}
            </div>
          </div>
        </div>
      {/each}
      <div class="py-3 font-bold">
        <div class="flex">
          <div class="flex-1">Total Daily Basic Rental</div>
          <div class="text-right w-28">
            ${format.currency(data.daily.gross)}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
