<script>
  import { format } from "$lib/format.js";
  export let data;
</script>

{#if data.specials.total > 0}
  <div class="bg-white rounded mb-4">
    <div class="px-4 py-2 border-b border-gray-200">
      <h2 class="h2">Specials</h2>
    </div>
    <div class="px-4">
      <div class="divide-y divide-gray-200">
        {#each data.specials.items as item, index}
          <div class="py-3">
            <div class="flex">
              <div class="flex-1">
                <div class="font-bold text-xs tracking-wider uppercase">{item.name}</div>
                {#each item.discount_list as dis}
                  <div>{@html dis.name} {@html dis.calculation}</div>
                {/each}
              </div>
              <div class="text-right w-28 whitespace-nowrap pt-5 text-red-700">
                {#each item.discount_list as dis}
                  <div>- ${format.currency(dis.discount_amount)}</div>
                {/each}
              </div>
            </div>
          </div>
        {/each}
        <div class="py-3 font-bold">
          <div class="flex">
            <div class="flex-1">Total Specials</div>
            <div class="text-right w-28 text-red-700">
              - ${format.currency(data.specials.total)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
