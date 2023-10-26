<script>
  import { supabase } from "$lib/supabaseClient";
  import dayjs from "dayjs";
  import { format } from "$lib/format.js";
  import { Checkbox, NumberInput } from "carbon-components-svelte";
  import { cal } from "$lib/cal.js";
  import { onMount } from "svelte";
  export let quote;
  // console.log("addons quote", quote.details);
  // console.log("addons quote", quote.details.addon_items);
  export let count;

  let addons = quote.details.addon_items || [];
  let duration = quote.details.duration;

  const checkAddon = async (addons, details) => {
    if (!addons.length) {
      duration = details.duration;

      // const selected_bond = Object.keys(details.bonds).length ? details.bonds : details.bond;
      // console.log(selected_bond);
      const { data: addonsData, error: addonsError } = await cal.getAddons(supabase, {
        date_start: dayjs(details.date_start),
        date_end: dayjs(details.date_end),
      });

      addonsData.forEach((addon, i1) => {
        let suppliers = addon.all_suppliers;
        let vehicles = addon.all_vehicles;

        if (!suppliers) {
          addon.addons_suppliers.forEach((obj) => {
            if (obj.suppliers.id === details.supplier.id) {
              suppliers = true;
            }
          });
        }
        if (!vehicles) {
          addon.addons_vehicles.forEach((obj) => {
            if (obj.vehicles.id === details.vehicle.id) {
              vehicles = true;
            }
          });
        }
        if (suppliers) {
          if (vehicles) {
            addon.addons.forEach((obj, i2) => {
              obj.id = `${i1}-${i2}`;
              obj.selected = false;
              for (const key in details.addons) {
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
              if (!obj.user_qty) {
                obj.user_qty = 1;
              }
              addons = [...addons, obj];
            });
          }
        }
      });
    } else {
      addons.forEach((addon) => {
        for (const key in details.addons) {
          if (key === addon.id) {
            // console.log("YES");
            addon.selected = true;
          }
        }
        // check cap
        let qty = 1;
        if (addon.daily) {
          let days = duration;
          let days_cap = 0;
          if (addon.gross_cap > 0) {
            days_cap = addon.gross_cap / addon.gross_rate;
          }
          if (days_cap > 0 && duration > days_cap) {
            days = days_cap;
          }
          qty = days;
        }
        if (!addon.user_qty) {
          addon.user_qty = qty;
        }
      });
    }
  };

  // onMount(async () => {
  //   checkAddon(addons, quote.details)
  // });
  function addonLabel(obj) {
    let result = obj.name;
    if (obj.daily) {
      result += ` ($${format.currency(obj.gross_rate)} x ${obj.user_qty} days)`;
    }
    return result;
  }
  function addonPrice(obj) {
    let result = obj.gross_rate;
    // if (obj.daily) {
    //   result = obj.gross_rate * obj.user_qty
    // } else if (obj.qty > 0) {
    //   result = obj.gross_rate * obj.user_qty
    // }
    result = obj.gross_rate * obj.user_qty;

    return `$${format.currency(result)}`;
  }

  $: checkAddon(addons, quote.details);
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Add-ons</h2>
  </div>
  <div class="p-4">
    {#each addons as item}
      {#if item.name !== ""}
        <div class="flex py-2">
          <div class="flex-1">
            <!-- labelText={`${item.name} ${item.daily ? `($${format.currency(item.gross_rate)} x ${duration} days)` : ""}`} -->
            <Checkbox
              checked={item.selected}
              labelText={addonLabel(item)}
              on:change={(e) => {
                if (e.target.checked) {
                  quote.details.addons[item.id] = item;
                  item.selected = true;
                } else {
                  delete quote.details.addons[item.id];
                  item.selected = false;
                }

                // console.log(item.selected);

                // console.log(quote.details.addons[item.id]);

                // addons = quote.details.addons;
                count();
              }}
            />
          </div>
          {#if item.selected && item.qty > 0 && !item.daily}
            <div class="w-20">
              <NumberInput
                bind:value={item.user_qty}
                max={item.qty}
                min={1}
                on:change={(e) => {
                  quote.details.addons[item.id].user_qty = e.detail;
                  quote.details.addons[item.id].gross = e.detail * item.gross_rate;
                  quote.details.addons[item.id].nett = e.detail * item.nett_rate;

                  // console.log(quote.details.addons[item.id]);
                  count();
                }}
              />
            </div>
          {/if}
          <div class="w-20 text-right">
            {addonPrice(item)}
            <!-- {#if item.selected && item.qty > 0}
            ${format.currency(item.gross_rate)}
          {:else}
            ${format.currency(item.gross_rate * item.user_qty)}
          {/if} -->
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>
