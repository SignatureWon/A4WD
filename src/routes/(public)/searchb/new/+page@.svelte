<script>
  import SearchFormAside from "$lib/components/public/SearchFormAside.svelte";
  import { Button, Modal, Tag, TextInput } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  let open = false;

  export let data;
  let paneHeight = 0;
</script>

<svelte:window bind:innerHeight={paneHeight} />
<aside class="h-screen w-80 bg-white fixed left-0 overflow-y-auto" style="height: {paneHeight - 120}px; top: 120px">
  <SearchFormAside />
</aside>

<div class="pl-80">
  <div class="max-w-6xl mx-auto p-4">
    {#each data.results as d}
      <div class="grid grid-cols-1 md:grid-cols-2 bg-white p-2 mb-4 gap-10">
        <div class="p-2">
          <h2 class="text-xl font-bold mb-2">{d.vehicle_name}</h2>
          <div class="my-4 text-center">
            <img
              src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{d.vehicle_image}?width=200&height=200&resize=contain"
              alt={d.vehicle_caption}
              class="mx-auto h-40"
            />
          </div>
          <VehicleFeatures
            record={{
              pax: d.vehicle_pax,
              wheel: d.vehicle_wheel,
              transmission: d.vehicle_transmission,
              fuel: d.vehicle_fuel,
              toilet: d.vehicle_toilet,
              shower: d.vehicle_shower,
            }}
          />
        </div>
        <div class="bg-brand-50 p-4 text-center flex flex-col">
          <div class="flex-1">
            <div class="text-2xl font-bold pt-2 pb-4">
              <sup>AUD</sup>
              ${formatCurrency(d.gross + d.one_way - d.special_total)}
            </div>
            {#if d.special_total > 0}
              <div class="text-sm">
                <s class="text-red-600">${formatCurrency(d.gross + d.one_way)}</s>
                Save ${formatCurrency(d.special_total)}
              </div>
            {/if}
            <div class="text-sm mb-4">
              Avg. per day ${formatCurrency((d.gross + d.one_way + d.fee_total - d.special_total) / d.duration)}
            </div>
            {#if d.special_total > 0}
              <div class="flex justify-center">
                {#if d.special_total > 0}
                  <div class="flex justify-center">
                    {#each d.special_items as item}
                      {#if item.active}
                        <Tag style="background-color: #f41a1a; color: #ffffff">
                          {item.name}
                        </Tag>
                      {/if}
                    {/each}
                  </div>
                {/if}
              </div>
            {/if}
            <div class="text-sm">
              <div>
                {#if d.license_id}
                  {d.license_name} license
                {:else}
                  Any license
                {/if}
              </div>
              <div>Min. driver's age {d.age_name}</div>
            </div>
            {#if d.min_days > d.duration}
              <div class="col-span-2 border border-red-600 p-2 text-sm text-red-600 rounded">
                Price is based on minimum {d.min_days} days, less days will average out.
              </div>
            {/if}
          </div>
          <div>
            <!-- <div class="flex justify-between border-t border-brand-300 pt-3">
            <div>
              <a href="/vehicles/{d.vehicle_slug}" class="py-1 px-2 rounded">
                View Specs
              </a>
            </div>
            <div>
              <a href="/vehicles/{d.vehicle_slug}" class="py-1 px-2 rounded">
                Rental Conditions
              </a>
            </div>
          </div> -->

            <div class="grid grid-cols-2 gap-4 mt-4">
              <!-- <Button
              class="rounded"
              size="small"
              kind="tertiary"
              on:click={(e) => {
                open = true;
              }}>Email Quote</Button
            > -->
              <Button class="rounded" size="small" kind="tertiary" href="/vehicles/{d.vehicle_slug}">View Specs</Button>
              <Button
                class="rounded"
                size="small"
                href={`/search/detail?pickup=${d.depot_id}&dropoff=${d.dropoff_id}&rates=${d.rates_id}&date_start=${data.search.date_start}&date_end=${data.search.date_end}&age=${d.age_id}&license=${d.license_id}&vehicle=${d.vehicle_id}`}
                >See Quote</Button
              >
            </div>
          </div>
        </div>
      </div>
    {/each}
    {#each data.blocked as d}
      <div class="grid grid-cols-1 md:grid-cols-2 bg-white p-2 mb-4 gap-10">
        <div class="p-2 opacity-50">
          <h2 class="text-xl font-bold mb-2">{d.vehicle_name}</h2>
          <div class="my-4 text-center">
            <img
              src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{d.vehicle_image}?width=200&height=200&resize=contain"
              alt={d.vehicle_caption}
              class="mx-auto h-40"
            />
          </div>
          <VehicleFeatures
            record={{
              pax: d.vehicle_pax,
              wheel: d.vehicle_wheel,
              transmission: d.vehicle_transmission,
              fuel: d.vehicle_fuel,
              toilet: d.vehicle_toilet,
              shower: d.vehicle_shower,
            }}
          />
        </div>
        <div class="bg-brand-50 p-4 text-center flex flex-col">
          <div class="flex-1">
            <div class="font-bold py-1 px-2 border border-black uppercase">Not available</div>
            {#each d.block_items as b}
              <div class="py-4">
                <div class="font-bold">
                  {b.name}
                </div>
                <div class="text-sm">
                  <pre class="font-sans">{b.description}</pre>
                </div>
              </div>
            {/each}
            {#if d.special_total > 0}
              <div class="flex justify-center">
                {#each d.special_items as item}
                  <Tag type="high-contrast">{item.name}</Tag>
                {/each}
              </div>
            {/if}
            <div class="text-sm">
              <div>
                {#if d.license_id}
                  {d.license_name} license
                {:else}
                  Any license
                {/if}
              </div>
              <div>Min. driver's age {d.age_name}</div>
            </div>
            {#if d.min_days > d.duration}
              <div class="col-span-2 border border-red-600 p-2 text-sm text-red-600 rounded">
                Price is based on minimum {d.min_days} days, less days will average out.
              </div>
            {/if}
          </div>
          <div>
            <Button class="rounded mx-auto" size="small" kind="tertiary" href="/vehicles/{d.vehicle_slug}">
              View Specs
            </Button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
