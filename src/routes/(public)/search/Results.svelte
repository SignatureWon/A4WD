<script>
  import { env } from "$env/dynamic/public";
  import { format } from "$lib/format";
  import { Button } from "carbon-components-svelte";
  export let results;
  export let search;
  export let url = "/search/detail";
  let paramSearch = []

  console.log("results", results);

  const icon = {
    pax: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" /></svg>`,
    wheel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M19.66 9.64L19.3 8.7L21.16 8C20.24 5.88 18.6 4.18 16.54 3.14L15.74 4.92L14.82 4.5L15.62 2.7C14.5 2.26 13.28 2 12 2C10.94 2 9.92 2.22 8.96 2.5L9.64 4.34L8.7 4.7L8 2.84C5.88 3.76 4.18 5.4 3.14 7.46L4.92 8.26L4.5 9.18L2.7 8.38C2.26 9.5 2 10.72 2 12C2 13.06 2.22 14.08 2.5 15.04L4.34 14.36L4.7 15.3L2.84 16C3.76 18.12 5.4 19.82 7.46 20.86L8.26 19.08L9.18 19.5L8.38 21.3C9.5 21.74 10.72 22 12 22C13.06 22 14.08 21.78 15.04 21.5L14.36 19.66L15.3 19.3L16 21.16C18.12 20.24 19.82 18.6 20.86 16.54L19.08 15.74L19.5 14.82L21.3 15.62C21.74 14.5 22 13.28 22 12C22 10.94 21.78 9.92 21.5 8.96L19.66 9.64M14.3 17.54C11.24 18.8 7.72 17.36 6.46 14.3S6.64 7.72 9.7 6.46 16.28 6.64 17.54 9.7C18.82 12.76 17.36 16.28 14.3 17.54Z" /></svg>`,
    transmission: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M8 5H4V2H8V5M4 22H8V19H4V22M14 2H10V5H14V2M10 22H14V19H10V22M16 2V5H20V2H16M17 11H13V7H11V11H7V7H5V17H7V13H11V17H13V13H19V7H17V11Z" /></svg>`,
    fuel: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z" /></svg>`,
    toilet: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M9,22H17V19.5C19.41,17.87 21,15.12 21,12V4A2,2 0 0,0 19,2H15C13.89,2 13,2.9 13,4V12H3C3,15.09 5,18 9,19.5V22M5.29,14H18.71C18.14,15.91 16.77,17.5 15,18.33V20H11V18.33C9,18 5.86,15.91 5.29,14M15,4H19V12H15V4M16,5V8H18V5H16Z" /></svg>`,
    shower: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M20,20A1,1 0 0,1 21,21A1,1 0 0,1 20,22A1,1 0 0,1 19,21A1,1 0 0,1 20,20M16,20A1,1 0 0,1 17,21A1,1 0 0,1 16,22A1,1 0 0,1 15,21A1,1 0 0,1 16,20M12,20A1,1 0 0,1 13,21A1,1 0 0,1 12,22A1,1 0 0,1 11,21A1,1 0 0,1 12,20M8,20A1,1 0 0,1 9,21A1,1 0 0,1 8,22A1,1 0 0,1 7,21A1,1 0 0,1 8,20M4,20A1,1 0 0,1 5,21A1,1 0 0,1 4,22A1,1 0 0,1 3,21A1,1 0 0,1 4,20M6,17A1,1 0 0,1 7,18A1,1 0 0,1 6,19H6A1,1 0 0,1 5,18A1,1 0 0,1 6,17H6M10,17A1,1 0 0,1 11,18A1,1 0 0,1 10,19A1,1 0 0,1 9,18A1,1 0 0,1 10,17M14,17A1,1 0 0,1 15,18A1,1 0 0,1 14,19A1,1 0 0,1 13,18A1,1 0 0,1 14,17M18,17A1,1 0 0,1 19,18A1,1 0 0,1 18,19A1,1 0 0,1 17,18A1,1 0 0,1 18,17M8,14A1,1 0 0,1 9,15A1,1 0 0,1 8,16A1,1 0 0,1 7,15A1,1 0 0,1 8,14M12,14A1,1 0 0,1 13,15A1,1 0 0,1 12,16A1,1 0 0,1 11,15A1,1 0 0,1 12,14M16,14A1,1 0 0,1 17,15A1,1 0 0,1 16,16A1,1 0 0,1 15,15A1,1 0 0,1 16,14M19,12H5V10H19V12M17.92,9H6.08C6.5,6.5 8.5,4.5 11,4.08V2H13V4.08C15.5,4.5 17.5,6.5 17.92,9Z" /></svg>`,
  };
  $: {
    for (const key in search) {
      paramSearch.push(`${key}=${search[key]}`)
    }
  }
</script>

<section class="container xl:max-w-7xl mx-auto p-4">
  {#each results.available as d}
    <div class="bg-white rounded overflow-hidden mb-3 relative">
      <div class="flex absolute w-full top-0 left-0">
        <div class="flex-1" />
        <div>
          <div class="flex">
            {#if d.special_total > 0}
              <div class="bg-red-500 text-white text-xs uppercase px-1 py-0.5 rounded-b mr-1">Specials</div>
            {/if}
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div class="md:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-3 h-full">
            <div class="p-2">
              <div class="rounded overflow-hidden">
                <img
                  src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{d.vehicle_image}?width=400&height=400&resize=contain"
                  alt={d.vehicle_caption}
                  class="w-full"
                />
              </div>
            </div>
            <div class="md:col-span-2 p-2 h-full">
              <div class="flex flex-col h-full">
                <div class="flex-1">
                  <h2 class="h2 font-bold">
                    {d.vehicle_name}
                  </h2>
                  <div>
                    <Button class="rounded p-0 text-sm" kind="ghost" href="/vehicles/{d.vehicle_slug}"
                      >View Specs</Button
                    >
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm max-w-xs mb-2">
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.pax}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_pax} Pax</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.wheel}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_wheel}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.transmission}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_transmission}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.fuel}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_fuel}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.toilet}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_toilet ? "Toilet" : "N/A"}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.shower}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_shower ? "Shower" : "N/A"}</div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="border border-gray-500 text-gray-500 text-xs uppercase px-2 py-0.5 rounded mr-1">
                    {#if d.license_id}
                      {d.license_name}
                    {:else}
                      Any license
                    {/if}
                  </div>
                  <div class="border border-gray-500 text-gray-500 text-xs uppercase px-2 py-0.5 rounded-b mr-1">
                    {d.age_name}
                  </div>
                  {#if d.special_total > 0}
                    <div class="flex">
                      {#each d.special_items as item}
                        {#if item.active}
                          <div class="border border-red-500 text-red-500 text-xs px-1 py-0.5 rounded mr-1">
                            {item.name}
                          </div>
                        {/if}
                      {/each}
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-brand-50 p-2 border border-brand-500 rounded-r h-full">
          <div class="flex flex-col h-full">
            <div class="flex-1">
              {#if d.special_total > 0}
                <div class="text-sm pt-2 opacity-30 -mt-2">
                  <s>${format.currency(d.gross)}</s>
                  <!-- <s>${format.currency(d.gross + d.one_way + d.fee_total)}</s> -->
                </div>
              {/if}
              <div class="h2 font-bold">
                ${format.currency(d.gross - d.special_total)}
                <!-- ${format.currency(d.gross + d.one_way + d.fee_total - d.special_total)} -->
              </div>
              {#if d.special_total > 0}
                <div class="text-sm text-red-500">
                  <div>Save ${format.currency(d.special_total)}</div>
                </div>
              {/if}
              <div class="text-sm mb-1">
                Avg. ${format.currency((d.gross - d.special_total) / d.duration)} per day
                on daily basic rental
                <!-- Avg. per day ${format.currency((d.gross + d.one_way + d.fee_total - d.special_total) / d.duration)} -->
              </div>
            </div>
            <div class="pt-2">
              {#if d.min_days > d.duration}
                <div class="bg-brand-200 px-2 py-1 mb-2 text-sm rounded">
                  <span class="opacity-50">
                    Price is based on minimum {d.min_days} days, less days will average out.
                  </span>
                </div>
              {/if}
              <!-- href={`${url}?selected=${encodeURIComponent(JSON.stringify(d))}&${paramSearch.join("&")}`} -->

              <Button
                class="rounded h-auto p-1.5 text-sm w-full inline-block uppercase tracking-wider"
                href={`${url}?rates=${d.rates_id}&type=${d.rates_type}&vehicle=${d.vehicle_id}&${paramSearch.join("&")}`}
              >
                See Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  <!-- {:else}
    <div class="bg-white rounded px-4 py-10">Start your search</div> -->
  {/each}
  {#each results.blocked as d}
    <div class="bg-white rounded overflow-hidden mb-3 relative">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
        <div class="md:col-span-3">
          <div class="grid grid-cols-1 md:grid-cols-3 h-full">
            <div class="p-2 opacity-50">
              <div class="rounded overflow-hidden">
                <img
                  src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{d.vehicle_image}?width=400&height=400&resize=contain"
                  alt={d.vehicle_caption}
                  class="w-full"
                />
              </div>
            </div>
            <div class="md:col-span-2 p-2 h-full opacity-50">
              <div class="flex flex-col h-full">
                <div class="flex-1">
                  <h2 class="h2 font-bold">
                    {d.vehicle_name}
                  </h2>
                  <div>
                    <Button class="rounded p-0 text-sm" kind="ghost" href="/vehicles/{d.vehicle_slug}"
                      >View Specs</Button
                    >
                  </div>
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-1 text-sm max-w-xs mb-2">
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.pax}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_pax} Pax</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.wheel}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_wheel}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.transmission}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_transmission}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.fuel}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_fuel}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.toilet}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_toilet ? "Toilet" : "N/A"}</div>
                    </div>
                    <div class="flex">
                      <div class="text-gray-300">{@html icon.shower}</div>
                      <div class="flex-1 ml-1 whitespace-nowrap">{d.vehicle_shower ? "Shower" : "N/A"}</div>
                    </div>
                  </div>
                </div>
                <div class="flex">
                  <div class="border border-gray-500 text-gray-500 text-xs uppercase px-2 py-0.5 rounded mr-1">
                    {#if d.license_id}
                      {d.license_name}
                    {:else}
                      Any license
                    {/if}
                  </div>
                  <div class="border border-gray-500 text-gray-500 text-xs uppercase px-2 py-0.5 rounded-b mr-1">
                    {d.age_name}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-brand-50 p-2 rounded-r h-full">
          <div class="bg-brand-200 px-2 py-1 mb-2 rounded">
            <span class="h2">Not Available</span>
          </div>
          {#each d.block_items as b}
            <div class="text-sm">
              <div class="font-bold">
                {b.name}
              </div>
              <div>
                {@html b.description}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/each}
</section>
