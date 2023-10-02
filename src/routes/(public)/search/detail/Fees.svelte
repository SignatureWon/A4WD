<script>
  import { format } from "$lib/format.js";
  import { Checkbox } from "carbon-components-svelte";
  import { onMount } from "svelte";
  export let data;
  export let search;
  export let count;

  const checkCap = (rate, cap) => {
    cap = cap || 0;
    let amount = rate;
    if (cap > 0) {
      amount = cap > rate ? rate : cap;
    }
    return amount;
  };
  const calculatePrice = (daily, rate, duration, cap) => {
    rate = rate || 0;
    cap = cap || 0;

    let sum = daily ? rate * duration : rate;
    let total = checkCap(sum, cap);

    return total;
  };
  // onMount(() => {
  //   if (!"addons" in data) {
  //     data.addons = {
  //       gross: 0,
  //       nett: 0,
  //       items: {},
  //     };
  //   }
  // });
</script>

{#if data.fees.items.length > 0 || data.addon_items.length > 0 || data.one_way > 0}
  <div class="bg-white rounded mb-4">
    {#if data.fees.items.length > 0 || data.one_way > 0}
      <div class="px-4 py-2 border-b border-gray-200">
        <h2 class="h2">Fees</h2>
      </div>
      <div class="px-4">
        <div class="divide-y divide-gray-200">
          {#if data.one_way > 0}
            <div class="flex py-3">
              <div class="flex-1">One-way fee</div>
              <div class="w-20 text-right">${format.currency(data.one_way)}</div>
            </div>
          {/if}
          {#each data.fees.items as item, index}
            <div class="py-3">
              <div class="flex">
                <div class="flex-1">
                  <div>{item.name}</div>
                </div>
                <div class="text-right w-28 whitespace-nowrap pt-5">
                  <div>${format.currency(item.fee)}</div>
                </div>
              </div>
            </div>
          {/each}
          <div class="py-3 font-bold">
            <div class="flex">
              <div class="flex-1">Total Fees</div>
              <div class="text-right w-28">
                ${format.currency(data.fees.total + data.one_way)}
              </div>
            </div>
          </div>
        </div>
      </div>
    {/if}
    {#if data.addon_items.length > 0}
      <div class="px-4 py-2 border-b border-gray-200">
        <h2 class="h2">Addons</h2>
      </div>
      <div class="px-4">
        <div class="divide-y divide-gray-200">
          {#each data.addon_items as item}
            <div class="py-3">
              <div class="flex">
                <div>
                  <Checkbox
                    on:change={(e) => {
                      if (e.target.checked) {
                        data.addons[item.id] = item;
                      } else {
                        delete data.addons[item.id];
                      }
                      count();
                    }}
                  />
                </div>
                <div class="flex-1">
                  <div>
                    {item.name}
                    {#if item.daily}
                      <div class="text-gray-400 text-sm font-bold">
                        (${format.currency(item.gross_rate)} x {search.duration} days{#if item.gross_cap > 0}; capped at
                          ${format.currency(item.gross_cap)}{/if})
                      </div>
                    {/if}
                  </div>
                  <div class="text-gray-400 text-sm">{item.description}</div>
                </div>
                <div class="text-right w-28 whitespace-nowrap">
                  ${format.currency(item.gross)}
                </div>
              </div>
            </div>
          {/each}
          <!-- <div class="py-3 font-bold">
            <div class="flex">
              <div class="flex-1">Total Addons</div>
              <div class="text-right w-28">
                ${format.currency(data.addons ? data.addons.gross : 0)}
              </div>
            </div>
          </div> -->
        </div>
      </div>
    {/if}
  </div>
{/if}
