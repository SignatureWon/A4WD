<script>
  import { format } from "$lib/format.js";
  import { Checkbox } from "carbon-components-svelte";
  import { cal } from "$lib/cal.js";
  import { onMount } from "svelte";
  export let quote;

  onMount(async () => {
    const selected_bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
    console.log(selected_bond);
    const { data: addonsData, error: addonsError } = await cal.getAddons(supabase, {
      date_start: dayjs(quote.details.date_start),
      date_end: dayjs(quote.details.date_end),
    });
    let addons = [];
    addonsData.forEach((addon) => {
      let suppliers = addon.all_suppliers;
      let vehicles = addon.all_vehicles;

      if (!suppliers) {
        addon.addons_suppliers.forEach((obj) => {
          if (obj.suppliers.id === quote.details.supplier.id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        addon.addons_vehicles.forEach((obj) => {
          if (obj.vehicles.id === quote.details.vehicle.id) {
            vehicles = true;
          }
        });
      }
      if (suppliers) {
        if (vehicles) {
          addons = [...addons, addon];
        }
      }
    });
  });
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Add-ons</h2>
  </div>
  <div class="p-4">
    {#if quote.details.one_way > 0}
      <div class="flex">
        <div class="flex-1">One-way fee</div>
        <div class="w-20 text-right">${format.currency(quote.details.one_way)}</div>
      </div>
    {/if}
    {#each quote.details.fees.items as item}
      <div class="flex">
        <div class="flex-1">{item.name}</div>
        <div class="w-20 text-right">${format.currency(item.fee)}</div>
      </div>
    {/each}
  </div>
</div>
