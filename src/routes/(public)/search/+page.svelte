<script>
  import { Button, Modal, Tag, TextInput } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  export let data;
  // console.log(data);
  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  let open = false;
</script>

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
          Avg. per day ${formatCurrency(
            (d.gross + d.one_way + d.fee_total - d.special_total) / d.duration
          )}
        </div>
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
          <div
            class="col-span-2 border border-red-600 p-2 text-sm text-red-600 rounded"
          >
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
          <Button
            class="rounded"
            size="small"
            kind="tertiary"
            href="/vehicles/{d.vehicle_slug}"
          >
            View Specs
          </Button>
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
        <div class="font-bold py-1 px-2 border border-black uppercase">
          Not available
        </div>
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
          <div
            class="col-span-2 border border-red-600 p-2 text-sm text-red-600 rounded"
          >
            Price is based on minimum {d.min_days} days, less days will average out.
          </div>
        {/if}
      </div>
      <div>
        <Button
          class="rounded mx-auto"
          size="small"
          kind="tertiary"
          href="/vehicles/{d.vehicle_slug}"
        >
          View Specs
        </Button>
      </div>
    </div>
  </div>
{/each}

<!-- {#each Array(10) as _} -->
<!-- <div class="grid grid-cols-1 md:grid-cols-2 bg-white p-2 mb-4 gap-10">
  <div>
    <h2 class="text-lg font-bold mb-2">Apollo Adventure Camper</h2>
    <div
      class="bg-cover bg-center bg-no-repeat h-48"
      style="background-image: url('https://rixauffklvvhkfkwrpme.supabase.co/storage/v1/object/public/gallery/thumb-vehicles-2b25d7e9-74df-4986-b578-78535c9034e5.jpg');"
    />
    <div class="px-4 mt-2">
      <p>
        The compact Adventure Camper is perfect for those interested in a real
        outback adventure. Roomier, more fuel capacity and cooking facilities
        make this 4WD campervan ideal for thrill seeking couples.
      </p>
      <div class="grid grid-cols-3 gap-2">
        <div class="flex items-center">
          <div class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="currentColor"
              ><path
                d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z"
              /></svg
            >
          </div>
          <div class="flex-1">4 Bed</div>
        </div>
        <div class="flex items-center">
          <div class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="currentColor"
              ><path
                d="M19.66 9.64L19.3 8.7L21.16 8C20.24 5.88 18.6 4.18 16.54 3.14L15.74 4.92L14.82 4.5L15.62 2.7C14.5 2.26 13.28 2 12 2C10.94 2 9.92 2.22 8.96 2.5L9.64 4.34L8.7 4.7L8 2.84C5.88 3.76 4.18 5.4 3.14 7.46L4.92 8.26L4.5 9.18L2.7 8.38C2.26 9.5 2 10.72 2 12C2 13.06 2.22 14.08 2.5 15.04L4.34 14.36L4.7 15.3L2.84 16C3.76 18.12 5.4 19.82 7.46 20.86L8.26 19.08L9.18 19.5L8.38 21.3C9.5 21.74 10.72 22 12 22C13.06 22 14.08 21.78 15.04 21.5L14.36 19.66L15.3 19.3L16 21.16C18.12 20.24 19.82 18.6 20.86 16.54L19.08 15.74L19.5 14.82L21.3 15.62C21.74 14.5 22 13.28 22 12C22 10.94 21.78 9.92 21.5 8.96L19.66 9.64M14.3 17.54C11.24 18.8 7.72 17.36 6.46 14.3S6.64 7.72 9.7 6.46 16.28 6.64 17.54 9.7C18.82 12.76 17.36 16.28 14.3 17.54Z"
              /></svg
            >
          </div>
          <div class="flex-1">4WD</div>
        </div>
        <div class="flex items-center">
          <div class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="currentColor"
              ><path
                d="M8 5H4V2H8V5M4 22H8V19H4V22M14 2H10V5H14V2M10 22H14V19H10V22M16 2V5H20V2H16M17 11H13V7H11V11H7V7H5V17H7V13H11V17H13V13H19V7H17V11Z"
              /></svg
            >
          </div>
          <div class="flex-1">Manual</div>
        </div>
        <div class="flex items-center">
          <div class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="currentColor"
              ><path
                d="M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z"
              /></svg
            >
          </div>
          <div class="flex-1">Diesel</div>
        </div>
        <div class="flex items-center">
          <div class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="currentColor"
              ><path
                d="M9,22H17V19.5C19.41,17.87 21,15.12 21,12V4A2,2 0 0,0 19,2H15C13.89,2 13,2.9 13,4V12H3C3,15.09 5,18 9,19.5V22M5.29,14H18.71C18.14,15.91 16.77,17.5 15,18.33V20H11V18.33C9,18 5.86,15.91 5.29,14M15,4H19V12H15V4M16,5V8H18V5H16Z"
              /></svg
            >
          </div>
          <div class="flex-1">Toilet</div>
        </div>
        <div class="flex items-center">
          <div class="mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              class="w-5 h-5"
              fill="currentColor"
              ><path
                d="M20,20A1,1 0 0,1 21,21A1,1 0 0,1 20,22A1,1 0 0,1 19,21A1,1 0 0,1 20,20M16,20A1,1 0 0,1 17,21A1,1 0 0,1 16,22A1,1 0 0,1 15,21A1,1 0 0,1 16,20M12,20A1,1 0 0,1 13,21A1,1 0 0,1 12,22A1,1 0 0,1 11,21A1,1 0 0,1 12,20M8,20A1,1 0 0,1 9,21A1,1 0 0,1 8,22A1,1 0 0,1 7,21A1,1 0 0,1 8,20M4,20A1,1 0 0,1 5,21A1,1 0 0,1 4,22A1,1 0 0,1 3,21A1,1 0 0,1 4,20M6,17A1,1 0 0,1 7,18A1,1 0 0,1 6,19H6A1,1 0 0,1 5,18A1,1 0 0,1 6,17H6M10,17A1,1 0 0,1 11,18A1,1 0 0,1 10,19A1,1 0 0,1 9,18A1,1 0 0,1 10,17M14,17A1,1 0 0,1 15,18A1,1 0 0,1 14,19A1,1 0 0,1 13,18A1,1 0 0,1 14,17M18,17A1,1 0 0,1 19,18A1,1 0 0,1 18,19A1,1 0 0,1 17,18A1,1 0 0,1 18,17M8,14A1,1 0 0,1 9,15A1,1 0 0,1 8,16A1,1 0 0,1 7,15A1,1 0 0,1 8,14M12,14A1,1 0 0,1 13,15A1,1 0 0,1 12,16A1,1 0 0,1 11,15A1,1 0 0,1 12,14M16,14A1,1 0 0,1 17,15A1,1 0 0,1 16,16A1,1 0 0,1 15,15A1,1 0 0,1 16,14M19,12H5V10H19V12M17.92,9H6.08C6.5,6.5 8.5,4.5 11,4.08V2H13V4.08C15.5,4.5 17.5,6.5 17.92,9Z"
              /></svg
            >
          </div>
          <div class="flex-1">Shower</div>
        </div>
      </div>
      <div class="flex justify-between mt-4 mb-2">
        <div>
          <a
            href="/vehicles/1"
            class="bg-emerald-100 py-1 px-2 hover:bg-emerald-300 rounded"
          >
            View Specs
          </a>
        </div>
        <div>
          <a
            href="/vehicles/1"
            class="bg-emerald-100 py-1 px-2 hover:bg-emerald-300 rounded"
          >
            Rental Conditions
          </a>
        </div>
      </div>
    </div>
  </div>
  <div class="bg-brand-50 p-4 text-center flex flex-col py-8">
    <div class="">
      <div class="md:text-xl font-bold flex justify-between">
        <div>Standard Price</div>
        <div>
          $245.00 per day
          <div class="text-sm font-normal">
            <s class="text-red-600">$260.00</s>
            Save $15.00
          </div>
        </div>
      </div>
      <div class="md:text-xl font-bold flex justify-between my-4">
        <div>Inclusive Price</div>
        <div>$245.00 per day</div>
      </div>
      <div class="text-sm mb-4">Avg. Std. $335.00/day</div>
      <hr />
      <div class="text-2xl font-bold pt-2 pb-4">
        <sup>Inclusive Price AUD</sup>
        $2,345.00
      </div>
      <div class="text-sm">
        <s class="text-red-600">$2,500.00</s>
        Save $155.00
      </div>
      <div class="text-sm mb-4">Avg. Std. $335.00/day</div>
    </div>
    <div class="grid grid-cols-2 gap-4 mt-4">
      <Button
        class="rounded"
        size="small"
        kind="tertiary"
        on:click={(e) => {
          open = true;
        }}>Email Quote</Button
      >
      <Button class="rounded" size="small" href="/search/details"
        >See Quote</Button
      >
    </div>
  </div>
</div> -->
<!-- {/each} -->

<Modal
  bind:open
  modalHeading="Send quote to my email"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit
>
  <div class="max-w-md mx-auto mt-10">
    <TextInput labelText="Name" class="mb-5" />
    <TextInput labelText="Email" class="mb-5" />
    <TextInput labelText="Phone" class="mb-5" />
  </div>
</Modal>
