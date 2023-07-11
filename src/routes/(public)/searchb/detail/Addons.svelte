<script>
  import { Checkbox } from "carbon-components-svelte";
  import { format } from "$lib/format.js";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()

  export let detail = {};
  export let quote = {
    addons: {
      gross: 0,
      nett: 0,
      items: [],
    },
  };

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
</script>

{#if detail.addon_items.length}
  <div class="pt-10">
    <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
      <div>Add-ons</div>
      <div>AUD $</div>
    </div>
    <div class="divide-y divide-gray-200">
      {#each detail.addon_items as item, index1}
        {#each item.addons as addon, index2}
          <div class="flex justify-between py-2">
            <div class="flex">
              <div>
                <Checkbox
                  on:change={(e) => {
                    let gross = calculatePrice(
                      addon.daily,
                      addon.gross_rate,
                      detail.duration,
                      addon.gross_cap
                    );
                    let nett = calculatePrice(
                      addon.daily,
                      addon.nett_rate,
                      detail.duration,
                      addon.nett_cap
                    );

                    if (e.target.checked) {
                      quote.addons.gross += gross;
                      quote.addons.nett += nett;
                      quote.addons.items[addon.name] = addon;
                    } else {
                      quote.addons.gross -= gross;
                      quote.addons.nett -= nett;
                      delete quote.addons.items[addon.name];
                    }

                    dispatch('change', quote);
                  }}
                />
              </div>
              <div>
                <div>
                  {addon.name}
                  {#if addon.daily}
                    {#if addon.gross_rate * detail.duration > addon.gross_cap}
                      {addon.gross_cap}
                    {:else}
                      (${format.currency(addon.gross_rate)} x {detail.duration} days)
                    {/if}
                  {/if}
                </div>
                <div class="text-gray-400 text-sm">{addon.description}</div>
              </div>
            </div>
            <div class="pl-4">
              {#if addon.daily}
                ${format.currency(addon.gross_rate * detail.duration)}
              {:else}
                ${format.currency(addon.gross_rate)}
              {/if}
            </div>
          </div>
        {/each}
      {/each}
    </div>
  </div>
{/if}
