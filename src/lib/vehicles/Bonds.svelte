<script>
  import { supabase } from "$lib/supabaseClient";
  import dayjs from "dayjs";
  import { format } from "$lib/format.js";
  import { cal } from "$lib/cal.js";
  import { onMount } from "svelte";
  import { RadioButton, RadioButtonGroup } from "carbon-components-svelte";
  export let quote;
  export let count;

  let bonds = [];
  let duration = 0;
  let selected = 0;

  onMount(async () => {
    const { data: bondsData, error: bondsError } = await cal.getBonds(supabase, {
      date_start: dayjs(quote.details.date_start),
      date_end: dayjs(quote.details.date_end),
    });
    bondsData.forEach((bond) => {
      let suppliers = bond.all_suppliers;
      let vehicles = bond.all_vehicles;

      if (!suppliers) {
        bond.packages_suppliers.forEach((obj) => {
          if (obj.suppliers.id === quote.details.supplier.id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        bond.packages_vehicles.forEach((obj) => {
          if (obj.vehicles.id === quote.details.vehicle.id) {
            vehicles = true;
          }
        });
      }
      if (suppliers) {
        if (vehicles) {
          bonds = [...bonds, bond];
        }
      }
    });

    duration = quote.details.duration;
    const selected_bond = Object.keys(quote.details.bonds).length ? quote.details.bonds : quote.details.bond;
    if (Object.keys(selected_bond).length) {
      bonds.forEach((item, index) => {
        if (item.id === selected_bond.id) {
          selected = index;
        }
      });
    }
  });
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Bonds</h2>
  </div>
  <div class="p-4">
    {#if bonds.length}
      <RadioButtonGroup orientation="vertical" {selected} class="w-full [&>fieldset]:w-full">
        {#each bonds as item, index}
          <div class="py-2 w-full">
            <div class="flex mb-2 justify-between w-full">
              <div class="flex-1 flex justify-start">
                <RadioButton
                  labelText={`${item.display_name} - ${item.liability.toLocaleString(
                    "en-US"
                  )} Excess, ${item.bond.toLocaleString("en-US")} Bond ($${format.currency(item.gross || 0)} x ${
                    item.cap ? (item.cap > duration ? duration : item.cap) : duration
                  } days)`}
                  value={index}
                  on:change={() => {
                    selected = index;
                    quote.details.bonds = item;
                    count();
                  }}
                />
              </div>
              <div class="whitespace-nowrap pl-4">
                ${format.currency(
                  (item.gross || 0) * (item.cap ? (item.cap > duration ? duration : item.cap) : duration)
                )}
              </div>
            </div>
            {#if item.gross > item.nett && item.nett > 0}
              <div class="flex w-full mb-2 justify-between text-sm text-gray-400">
                <div class="pl-7">
                  Nett: ${item.nett} x {duration} days
                </div>
                <div class="whitespace-nowrap pl-4">
                  ${format.currency(
                    (item.nett || 0) * (item.cap ? (item.cap > duration ? duration : item.cap) : duration)
                  )}
                </div>
              </div>
              <div class="flex w-full mb-2 justify-between text-sm text-gray-400">
                <div class="pl-7">
                  Commission: ${format.currency(item.gross - item.nett)} x {duration} days
                </div>
                <div class="whitespace-nowrap pl-4">
                  ${format.currency(
                    (item.gross - item.nett || 0) * (item.cap ? (item.cap > duration ? duration : item.cap) : duration)
                  )}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      </RadioButtonGroup>
    {:else}
      <div class="p-3 bg-gray-50 text-gray-400 text-center">No bonds</div>
    {/if}
  </div>
</div>
