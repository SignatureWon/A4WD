<script>
  import { Checkbox } from "carbon-components-svelte";
  import { format } from "$lib/format.js";

  export let addons;
  export let list;
  export let fees;
  export let duration;
  export let count;
  export let bond;

  console.log("bond", bond);
  
  if (!list) {
    list = []
  }

  let poplist = [];
  const getAddons = () => {
    poplist = [];
    list.forEach((item, i1) => {
      item.addons.forEach((a, i2) => {
        let gross = a.daily ? a.gross_rate * duration : a.gross_rate;
        let nett = a.daily ? a.nett_rate * duration : a.nett_rate;

        if (gross > a.gross_cap && a.gross_cap > 0) {
          gross = a.gross_cap;
        }
        if (nett > a.nett_cap && a.nett_cap > 0) {
          nett = a.nett_cap;
        }

        let id = `${i1}-${i2}`
        let selected = false

        for (const key in addons) {
          if (key === id) {
            selected = true
          }
        }

        let addon = {
          id: id,
          selected: selected,
          name: a.name,
          total: gross,
          nett: nett,
          profit: nett > 0 ? gross - nett : 0,
          daily: a.daily,
          daily_gross: a.gross_rate,
          daily_nett: a.nett_rate,
          day: duration,
          description: a.description,
          nett_rate: a.nett_rate,
          gross_rate: a.gross_rate,
          nett_cap: 0,
          gross_cap: 0,
        }

        poplist.push(addon);

        if (selected) {
          fees[id] = addon;
        }
      });
    });
    
    count();
  };
  $: getAddons();
</script>

{#each poplist as addon}
  <div class="border-b border-gray-200 pt-3 pb-1">
    <div class="flex justify-between mb-2">
      <div class="flex">
        <div>
          <Checkbox
            checked={addon.selected}
            on:change={(e) => {
              if (e.target.checked) {
                fees[addon.id] = addon;
              } else {
                delete fees[addon.id];
              }
              addons = fees

              // console.log(addons);
              
              count();
            }}
          />
        </div>
        <div>
          <div>
            {addon.name}
            {#if addon.daily}
              (${format.currency(addon.daily_gross)} x {duration} days)
              <!-- {#if addon.daily_gross * duration > addon.total}
                  Max: ${format.currency(addon.total)}
                {/if} -->
            {/if}
          </div>
          <!-- <div class="text-gray-400 text-sm">{addon.description}</div> -->
        </div>
      </div>
      <div class="pl-4">
        ${format.currency(addon.total)}
      </div>
    </div>
    {#if addon.total > addon.nett && addon.nett > 0}
      <div class="flex w-full mb-2 justify-between text-sm text-gray-400">
        <div class="pl-7">
          Nett
          {#if addon.daily}
            (${format.currency(addon.daily_nett)} x {duration} days)
          {/if}
        </div>
        <div class="whitespace-nowrap pl-4">
          ${format.currency(addon.nett)}
        </div>
      </div>
      <div class="flex w-full mb-2 justify-between text-sm text-gray-400">
        <div class="pl-7">
          Commission
          {#if addon.daily}
            (${format.currency(addon.daily_gross - addon.daily_nett)} x {duration} days)
          {/if}
        </div>
        <div class="whitespace-nowrap pl-4">
          ${format.currency(addon.total - addon.nett)}
        </div>
      </div>
    {/if}
  </div>
{:else}
  <div class="border border-gray-200 p-4 text-center">No add-ons</div>
{/each}
