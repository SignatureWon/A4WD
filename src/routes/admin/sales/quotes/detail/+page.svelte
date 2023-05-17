<script>
  import dayjs from "dayjs";
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(isBetween);
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import { env } from "$env/dynamic/public";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  import { Button } from "carbon-components-svelte";

  export let data;

  const d = data.detail;
  console.log(d);

  let showFeeDetails = false;
</script>

<PageTitle title="Detail" />

<div class="bg-white p-4 divide-y divide-gray-200">
  <FormSection>
    <div>
      <img
        src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{d.vehicle_image}?width=300&height=300&resize=contain"
        alt={d.vehicle_caption}
      />
    </div>
    <div>
      <div class="text-2xl font-bold mb-4">{d.vehicle_name}</div>
      <VehicleFeatures
        record={{
          excerpt: d.vehicle_excerpt,
          pax: d.vehicle_pax,
          wheel: d.vehicle_wheel,
          transmission: d.vehicle_transmission,
          fuel: d.vehicle_fuel,
          toilet: d.vehicle_toilet,
          shower: d.vehicle_shower,
        }}
      />
    </div>
  </FormSection>
  <div
    class="px-5 py-8 bg-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5 text-center"
  >
    <div>
      <div class="label">Gross</div>
      <div class="text-2xl">${d.gross.toFixed(2)}</div>
    </div>
    <div>
      <div class="label">Nett</div>
      <div class="text-2xl">${d.nett.toFixed(2)}</div>
    </div>
    <div>
      <div class="label">Earnings</div>
      <div class="text-2xl">${d.profit.toFixed(2)}</div>
    </div>
  </div>
  <FormSection title="Route">
    <div>
      <div class="label">Pick-up</div>
      <div class="value">{d.depot_name}</div>
    </div>
    <div>
      <div class="label">Drop-off</div>
      <div class="value">{d.dropoff_name}</div>
    </div>
  </FormSection>
  <FormSection title="Travel">
    <div>
      <div class="label">Start Date</div>
      <div class="value">{dayjs(data.search.date_start).format("DD/MM/YYYY")}</div>
    </div>
    <div>
      <div class="label">End Date</div>
      <div class="value">{dayjs(data.search.date_end).format("DD/MM/YYYY")}</div>
    </div>
  </FormSection>
  <FormSection title="Driver">
    <div>
      <div class="label">License</div>
      <div class="value">{d.license_name}</div>
    </div>
    <div>
      <div class="label">Age</div>
      <div class="value">{d.age_name}</div>
    </div>
  </FormSection>
  <FormSection title="Fees">
    <div class="col-span-2 flex text-lg">
      <div class="flex-1">
        Daily rental ({d.duration} days)
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="cursor-pointer text-brand-600 text-sm"
          on:click={() => (showFeeDetails = !showFeeDetails)}>Details</span
        >
      </div>
      <div class="w-32 text-right">${d.gross.toFixed(2)}</div>
    </div>
    <div class="col-span-2 text-sm {showFeeDetails ? 'block' : 'hidden'}">
      {#each d.list as item}
        <div class="flex">
          <div class="flex-1">
            {dayjs(item.day).format("DD/MM/YYYY")}
          </div>
          <div class="w-32 text-right">${item.gross.toFixed(2)}</div>
        </div>
      {/each}
    </div>
    {#if d.min_days > d.duration}
      <div class="col-span-2 bg-amber-50 p-3 text-sm text-amber-600 rounded">
        Price is based on minimum {d.min_days} days, less days is average out.
      </div>
    {/if}
    {#if d.one_way > 0}
      <div class="col-span-2 flex text-lg">
        <div class="flex-1">One-way Fee</div>
        <div class="w-32 text-right">${d.one_way}</div>
      </div>
    {/if}
    {#if d.fee_total > 0}
      {#each d.fee_items as item}
        <div class="col-span-2 flex text-lg">
          <div class="flex-1">{item.name}</div>
          <div class="w-32 text-right">${item.fee}</div>
        </div>
      {/each}
    {/if}
    {#if d.special_total > 0}
      {#each d.special_items as item}
        <div
          class="col-span-2 flex text-sm font-semibold text-gray-400 tracking-wide -mb-3"
        >
          Deduct: {item.name}
        </div>
        <div class="col-span-2 flex text-lg">
          <div class="flex-1">
            <div>
              {#if item.type === "Early bird"}
                Early bird ({item.days} days)
              {:else if item.type === "Long term"}
                Long term ({item.days} days)
              {:else if item.type === "Every X day"}
                Every {item.days} day
              {/if}
              {#if item.factor === "Percentage"}
                Discount {item.value}%
              {:else if item.factor === "Price"}
                Discount ${item.value}
              {:else if item.factor === "Day"}
                Discount {item.value} {item.value > 1 ? "days" : "day"}
              {:else if item.factor === "No One Way Fee"}
                No One Way Fee
              {/if}
            </div>
          </div>
          <div class="w-32 text-right">
            - ${item.discount_amount.toFixed(2)}
          </div>
        </div>
        {#if item.discount2}
          <div class="col-span-2 flex text-lg">
            <div class="flex-1">
              <div>
                {#if item.type2 === "Early bird"}
                  Early bird ({item.days2} days)
                {:else if item.type2 === "Long term"}
                  Long term ({item.days2} days)
                {:else if item.type2 === "Every X day"}
                  Every {item.days2} day
                {/if}
                {#if item.factor2 === "Percentage"}
                  Discount {item.value2}%
                {:else if item.factor2 === "Price"}
                  Discount ${item.value2}
                {:else if item.factor2 === "Day"}
                  Discount {item.value2} {item.value2 > 1 ? "days" : "day"}
                {:else if item.factor2 === "No One Way Fee"}
                  No One Way Fee
                {/if}
              </div>
            </div>
            <div class="w-32 text-right">- ${item.discount_amount2}</div>
          </div>
        {/if}
      {/each}
    {/if}
  </FormSection>
  <div class="flex text-2xl bg-gray-100 p-4">
    <div class="flex-1">Total</div>
    <div class="w-32 text-right">
      ${(d.gross + d.one_way + d.fee_total - d.special_total).toFixed(2)}
    </div>
  </div>
  <div class="flex justify-between pt-10">
    <Button kind="ghost" href="/admin/sales/quotes">Back</Button>
    <Button>Create Quote</Button>
  </div>
</div>

<style>
  .label {
    @apply text-sm font-semibold text-gray-400 tracking-wide mb-1;
  }
  .value {
    @apply text-lg;
  }
</style>
