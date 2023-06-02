<script>
  import { Checkbox } from "carbon-components-svelte";
  import { format } from "$lib/format.js";

  export let addons;
  export let fees;
  export let duration;
  // export let bond;

  let list = [];
  const getAddons = () => {
    list = [];
    addons.forEach((item) => {
      item.addons.forEach((a) => {
        let gross = a.daily ? a.gross_rate * duration : a.gross_rate;
        let nett = a.daily ? a.nett_rate * duration : a.nett_rate;

        if (gross > a.gross_cap && a.gross_cap > 0) {
          gross = a.gross_cap;
        }
        if (nett > a.nett_cap && a.nett_cap > 0) {
          nett = a.nett_cap;
        }

        list.push({
          name: a.name,
          total: gross,
          nett: nett,
          profit: gross - nett,
          daily: a.daily,
          daily_gross: a.gross_rate,
          daily_nett: a.nett_rate,
          day: duration,
          description: a.description,
        });
      });
    });
  };
  $: getAddons();
</script>

{#each list as addon}
  <div class="border-b border-gray-200 pt-3 pb-1">
    <div class="flex justify-between mb-2">
      <div class="flex">
        <div>
          <Checkbox
            on:change={(e) => {
              if (e.target.checked) {
                fees[addon.name] = addon
              } else {
                delete fees[addon.name];
              }
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
  <div class="border border-gray-200 p-8 text-center">No add-ons</div>
{/each}
