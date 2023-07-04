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
              {`Daily basic rental: ${item.flex ? `Week ${item.week}: Flex[${item.flex}]: ` : ``} $${format.currency(
                item.daily.gross
              )} x ${item.days} days`}
              <div class="text-gray-400 text-sm">Nett: ${format.currency(item.daily.nett)} x {item.days} days</div>
              <div class="text-gray-400 text-sm">Comm: ${format.currency(item.daily.profit)} x {item.days} days</div>
            </div>
            <div class="text-right w-28">
              ${format.currency(item.total)}
              <div class="text-gray-400 text-sm">${format.currency(item.nett)}</div>
              <div class="text-gray-400 text-sm">${format.currency(item.profit)}</div>
            </div>
          </div>
        </div>
      {/each}
      <div class="py-3 font-bold">
        <div class="flex">
          <div class="flex-1">
            Total Daily Basic Rental
            <div class="text-gray-400 text-sm">Total Nett</div>
            <div class="text-gray-400 text-sm">Total Commission</div>
          </div>
          <div class="text-right w-28">
            ${format.currency(data.daily.gross)}
            <div class="text-gray-400 text-sm">${format.currency(data.daily.nett)}</div>
            <div class="text-gray-400 text-sm">${format.currency(data.daily.profit)}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
