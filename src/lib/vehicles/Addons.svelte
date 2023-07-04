<script>
  import { supabase } from "$lib/supabaseClient";
  import dayjs from "dayjs";
  import { format } from "$lib/format.js";
  import { Checkbox } from "carbon-components-svelte";
  import { cal } from "$lib/cal.js";
  import { onMount } from "svelte";
  export let quote;
  console.log(quote);
  export let count;

  let addons = [];
  let duration = 0;

  onMount(async () => {
    duration = quote.details.duration;

    const selected_bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
    // console.log(selected_bond);
    const { data: addonsData, error: addonsError } = await cal.getAddons(supabase, {
      date_start: dayjs(quote.details.date_start),
      date_end: dayjs(quote.details.date_end),
    });

    addonsData.forEach((addon, i1) => {
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
          addon.addons.forEach((obj, i2) => {
            obj.id = `${i1}-${i2}`;
            obj.selected = false;
            for (const key in quote.details.addons) {
              if (key === obj.id) {
                obj.selected = true;
              }
            }

            obj.gross = obj.daily ? obj.gross_rate * duration : obj.gross_rate;
            obj.nett = obj.daily ? obj.nett_rate * duration : obj.nett_rate;

            if (obj.gross > obj.gross_cap && obj.gross_cap > 0) {
              obj.gross = obj.gross_cap;
            }
            if (obj.nett > obj.nett_cap && obj.nett_cap > 0) {
              obj.nett = obj.nett_cap;
            }
            addons = [...addons, obj];
          });
        }
      }
    });
    // console.log(addons);
  });
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Add-ons</h2>
  </div>
  <div class="p-4">
    {#each addons as item}
      <div class="flex py-2">
        <div class="flex-1">
          <Checkbox
            checked={item.selected}
            labelText={`${item.name} ${item.daily ? `($${format.currency(item.gross_rate)} x ${duration} days)` : ""}`}
            on:change={(e) => {
              if (e.target.checked) {
                quote.details.addons[item.id] = item;
              } else {
                delete quote.details.addons[item.id];
              }
              // addons = quote.details.addons;
              count();
            }}
          />
        </div>
        <div class="w-20 text-right">${format.currency(item.gross)}</div>
      </div>
    {/each}
  </div>
</div>
