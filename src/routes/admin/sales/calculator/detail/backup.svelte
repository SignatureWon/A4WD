<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  import {
    Button,
    Checkbox,
    Modal,
    NumberInput,
    RadioButton,
    RadioButtonGroup,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";
  export let data;

  const d = data.detail;
  console.log(d);

  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  let booking = {
    date_book: dayjs(),
    date_start: dayjs(data.search.date_start),
    date_end: dayjs(data.search.date_end),
    pax: dayjs(data.search.pax),
    duration: d.duration,
    min_days: d.min_days,
    rates_type: d.rates_type,
    rates_nett: d.rates_nett,
    rates_gross: d.rates_gross,
    pickup: {
      id: d.depot_id,
      name: d.depot_name,
    },
    dropoff: {
      id: d.dropoff_id,
      name: d.dropoff_name,
    },
    vehicle: {
      id: d.vehicle_id,
      name: d.vehicle_name,
      image: `${env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/${d.vehicle_image}?width=600&height=600&resize=contain`,
      excerpt: d.vehicle_excerpt,
      slug: d.vehicle_slug,
      fuel: d.vehicle_fuel,
      pax: d.vehicle_pax,
      shower: d.vehicle_shower,
      toilet: d.vehicle_toilet,
      wheel: d.vehicle_wheel,
      transmission: d.vehicle_transmission,
    },
    supplier: {
      id: d.supplier_id,
      name: d.supplier_name,
    },
    age: {
      id: d.age_id,
      name: d.age_name,
    },
    daily: {
      gross: d.gross,
      nett: d.nett,
      profit: d.profit,
      items: d.list,
    },
    fees: {
      total: d.fee_total,
      items: d.fee_items,
    },
    one_way: d.one_way,
    specials: {
      total: d.special_total,
      items: d.special_items,
    },
    bonds: {},
    addons: {},
    terms: d.terms,
    add_discount: 0,
    add_discount_remark: "",
  };
  let showFeeDetails = false;
  let modalSendQuote = false;

  let selected_bond = 0;
  let bond_fee = 0;
  if (d.bond_items.length) {
    bond_fee =
      d.bond_items[0].gross *
      (d.duration < (d.bond_items[0].cap || 0)
        ? d.duration
        : d.bond_items[0].cap || 0);
  }
  let addon_fee = 0;
  let total =
    d.gross + d.one_way + d.fee_total + bond_fee + addon_fee - d.special_total - booking.add_discount;

  $: total =
    d.gross + d.one_way + d.fee_total + bond_fee + addon_fee - d.special_total - booking.add_discount;
</script>

<PageTitle title="Detail" />
<section class="bg-white mb-8">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">Trip Details</h2>
  </div>
  <!-- <h2 class="uppercase tracking-wider font-bold mb-2">Trip Summary</h2> -->
  <div class="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
    <div class="my-4 text-center">
      <img
        src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{d.vehicle_image}?width=200&height=200&resize=contain"
        alt={d.vehicle_caption}
      />
    </div>
    <div class="px-4 col-span-2">
      <h2 class="text-lg font-bold mb-4">{d.vehicle_name}</h2>
      <div class="flex items-center justify-between py-2">
        <div class="w-5/12">
          <div
            class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400"
          >
            Pick-up
          </div>
          <div class="font-bold text-lg">{d.depot_name}</div>
          <div>{dayjs(data.search.date_start).format("DD/MM/YYYY (ddd)")}</div>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="w-4 h-4"
            fill="currentColor"
            ><path fill="none" d="M0 0h24v24H0z" /><path
              d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            /></svg
          >
        </div>
        <div class="w-5/12">
          <div
            class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400"
          >
            Drop-off
          </div>
          <div class="font-bold text-lg">{d.dropoff_name}</div>
          <div>{dayjs(data.search.date_end).format("DD/MM/YYYY (ddd)")}</div>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="bg-white mb-8">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">Price Details</h2>
  </div>
  <div class="p-4">
    <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
      <div>Fee</div>
      <div>AUD $</div>
    </div>
    <div class="divide-y divide-gray-200">
      <div>
        <div class="flex justify-between py-2">
          <div>
            Daily Rental ({d.duration} days)
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span
              class="cursor-pointer text-brand-600 text-sm"
              on:click={() => (showFeeDetails = !showFeeDetails)}>Details</span
            >
          </div>
          <div class="whitespace-nowrap pl-4">${formatCurrency(d.gross)}</div>
        </div>
        <div
          class="col-span-2 text-sm text-gray-400 {showFeeDetails
            ? 'block'
            : 'hidden'}"
        >
          {#each d.list as item, index}
            <div class="flex justify-between mb-2">
              <div>
                Day {index + 1}: {dayjs(item.day).format("DD/MM/YYYY")}
              </div>
              <div class="whitespace-nowrap pl-4">
                ${formatCurrency(item.gross)}
              </div>
            </div>
          {/each}
        </div>
        {#if d.min_days > d.duration}
          <div
            class="col-span-2 bg-amber-50 p-3 text-sm text-amber-600 rounded mb-3"
          >
            Price is based on minimum {d.min_days} days, less days will average out.
          </div>
        {/if}
      </div>
      {#if d.one_way > 0}
        <div class="flex justify-between py-2">
          <div>One-way Fee</div>
          <div class="whitespace-nowrap pl-4">${formatCurrency(d.one_way)}</div>
        </div>
      {/if}
      {#if d.fee_total > 0}
        {#each d.fee_items as item}
          <div class="flex justify-between py-2">
            <div>{item.name}</div>
            <div class="whitespace-nowrap pl-4">
              ${formatCurrency(item.fee)}
            </div>
          </div>
        {/each}
      {/if}
      {#if d.special_total > 0}
        {#each d.special_items as item}
          <div>
            <div class="col-span-2 flex font-semibold tracking-wide pt-2">
              Deduct: {item.name}
            </div>
            <div class="flex justify-between py-2">
              <div>
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
                <div class="text-sm text-gray-400">
                  {item.description}
                </div>
              </div>
              <div class="whitespace-nowrap pl-4">
                - ${formatCurrency(item.discount_amount)}
              </div>
            </div>
            {#if item.discount2}
              <div class="flex justify-between py-2">
                <div>
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
                <div class="whitespace-nowrap pl-4">
                  - ${formatCurrency(item.discount_amount2)}
                </div>
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </div>
  <div class="p-4">
    <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
      Accident Liability
    </div>
    <div>
      <RadioButtonGroup
        orientation="vertical"
        selected={0}
        class="w-full [&>fieldset]:w-full"
      >
        {#each d.bond_items as b, i}
          <div
            class="flex mb-2 justify-between w-full pt-2 pb-3 border-b border-gray-200"
          >
            <div class="flex-1 flex justify-start">
              <RadioButton
                labelText={`${b.display_name} - ${b.liability.toLocaleString(
                  "en-US"
                )} Excess, ${b.bond.toLocaleString(
                  "en-US"
                )} Bond (${formatCurrency(b.gross || 0)} x ${
                  b.cap ? (b.cap > d.duration ? d.duration : b.cap) : d.duration
                } days)                
                `}
                value={i}
                on:change={() => {
                  selected_bond = i;
                  bond_fee =
                    b.gross *
                    (d.duration < (b.cap || 0) ? d.duration : b.cap || 0);
                  booking.bonds = b;
                  console.log(booking);
                }}
              />
            </div>
            <div class="whitespace-nowrap pl-4">
              ${formatCurrency(
                (b.gross || 0) *
                  (b.cap
                    ? b.cap > d.duration
                      ? d.duration
                      : b.cap
                    : d.duration)
              )}
            </div>
          </div>
        {/each}
      </RadioButtonGroup>
    </div>
  </div>
  {#if d.addon_items.length}
    <div class="p-4">
      <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
        <div>Add-ons</div>
      </div>
      <div class="divide-y divide-gray-200">
        {#each d.addon_items as item, index1}
          {#each item.addons as addon, index2}
            <div class="flex justify-between py-2">
              <div class="flex">
                <div>
                  <Checkbox
                    on:change={(e) => {
                      let fee = addon.daily
                        ? addon.gross_rate * d.duration
                        : addon.gross_rate;
                      if (e.target.checked) {
                        addon_fee += fee;
                        booking.addons[`${index1}-${index2}`] = addon;
                      } else {
                        addon_fee -= fee;
                        delete booking.addons[`${index1}-${index2}`];
                      }
                      console.log(booking);
                    }}
                  />
                </div>
                <div>
                  <div>
                    {addon.name}
                    {#if addon.daily}
                      {#if addon.gross_rate * d.duration > addon.gross_cap}
                        {addon.gross_cap}
                      {:else}
                        (${formatCurrency(addon.gross_rate)} x {d.duration} days)
                      {/if}
                    {/if}
                  </div>
                  <div class="text-gray-400 text-sm">{addon.description}</div>
                </div>
              </div>
              <div class="pl-4">
                {#if addon.daily}
                  ${formatCurrency(addon.gross_rate * d.duration)}
                {:else}
                  ${formatCurrency(addon.gross_rate)}
                {/if}
              </div>
            </div>
          {/each}
        {/each}
      </div>
    </div>
  {/if}
</section>
<section class="bg-white mb-8">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">Discount</h2>
  </div>
  <div class="p-4">
    <div class="flex">
      <div class="flex-1">
        <TextInput labelText="Remark" bind:value={booking.add_discount_remark} />
      </div>
      <div class="w-40 ml-4">
        <NumberInput label="Amount" bind:value={booking.add_discount} step={0.01} />
      </div>
    </div>
  </div>
  <div
    class="p-4 border-t border-gray-200 flex justify-between text-xl font-bold"
  >
    <div>Total</div>
    <div>${formatCurrency(total)}</div>
  </div>
</section>

<section class="bg-white mb-8">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">Payment Details</h2>
  </div>
  <div class="p-4">
    <div
      class="uppercase tracking-wider font-bold mb-3 text-gray-400 flex justify-between"
    >
      <div>Payment</div>
      <div>AUD $</div>
    </div>
    <div class="divide-y divide-gray-200">
      <div class="flex justify-between py-2">
        <div>
          Booking Deposit ({d.terms.percentage
            ? `${d.terms.deposit}%`
            : `$${d.terms.deposit}`})
          {#if d.terms.description}
            <div class="text-gray-400 text-sm">
              {d.terms.description}
            </div>
          {/if}
        </div>
        <div>
          {#if d.terms.percentage}
            ${formatCurrency((total * d.terms.deposit) / 100)}
          {:else}
            ${formatCurrency(d.terms.deposit)}
          {/if}
        </div>
      </div>
      {#if d.terms.payment2}
        <div class="flex justify-between py-2">
          <div>
            1st Payment ({d.terms.percentage2
              ? `${d.terms.deposit2}%`
              : `$${d.terms.deposit2}`} - {d.terms.balance2} days before travel)
            {#if d.terms.description2}
              <div class="text-gray-400 text-sm">
                {d.terms.description2}
              </div>
            {/if}
          </div>
          <div>
            {#if d.terms.percentage2}
              ${formatCurrency((total * d.terms.deposit2) / 100)}
            {:else}
              ${formatCurrency(d.terms.deposit2)}
            {/if}
          </div>
        </div>
      {/if}
      {#if d.terms.payment3}
        <div class="flex justify-between py-2">
          <div>
            2nd Payment ({d.terms.percentage3
              ? `${d.terms.deposit3}%`
              : `$${d.terms.deposit3}`} - {d.terms.balance3} days before travel)
            {#if d.terms.description3}
              <div class="text-gray-400 text-sm">
                {d.terms.description3}
              </div>
            {/if}
          </div>
          <div>
            {#if d.terms.percentage3}
              ${formatCurrency((total * d.terms.deposit3) / 100)}
            {:else}
              ${formatCurrency(d.terms.deposit3)}
            {/if}
          </div>
        </div>
      {/if}
      <div class="flex justify-between py-2">
        <div>
          Balance ({d.terms.pay_counter
            ? "Pay at pick-up counter"
            : `${d.terms.balance} days before travel`})
        </div>
        <div>
          ${formatCurrency(
            total -
              (d.terms.percentage
                ? (total * d.terms.deposit) / 100
                : d.terms.deposit) -
              (d.terms.percentage2
                ? (total * (d.terms.deposit2 || 0)) / 100
                : d.terms.deposit2 || 0) -
              (d.terms.percentage3
                ? (total * (d.terms.deposit3 || 0)) / 100
                : d.terms.deposit3 || 0)
          )}
        </div>
      </div>
    </div>
  </div>
</section>
<section class="bg-white p-4 mb-0.5">
  <!-- <div class="text-xl font-bold text-center mb-4">
      Book now with ${formatCurrency(
        d.terms.percentage ? (total * d.terms.deposit) / 100 : d.terms.deposit
      )} deposit only
    </div> -->
  <div class="text-center pt-3">
    <Button
      type="submit"
      class="px-10"
      on:click={() => (modalSendQuote = true)}
    >
      Create Quote
    </Button>
  </div>
</section>
<Modal
  bind:open={modalSendQuote}
  modalHeading="Customer Information"
  passiveModal
  on:click:button--secondary={() => (modalSendQuote = false)}
>
  <div class="max-w-md mx-auto mt-10 mb-5">
    <form action="/admin/sales/calculator/book" method="post">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-2">
          <TextInput labelText="Email" type="email" name="email" required />
        </div>
        <div>
          <Select
            name="license"
            labelText="Driver's License"
            value={data.search.license}
          >
            {#each data.options.licenses as license}
              <SelectItem value={license.name} />
            {/each}
          </Select>
        </div>
        <div>
          <NumberInput name="age" label="Driver's Age" allowEmpty required />
        </div>
        <div>
          <NumberInput name="adult" label="No. of Adult" allowEmpty required />
        </div>
        <div>
          <NumberInput
            name="children"
            label="No. of Children"
            allowEmpty
            required
          />
        </div>
        <div class="col-span-2">
          <Button type="submit" class="w-full">Proceed</Button>
          <Button
            kind="ghost"
            type="button"
            class="w-full"
            on:click={() => (modalSendQuote = false)}>Cancel</Button
          >
        </div>
      </div>
      <input type="hidden" name="detail" value={JSON.stringify(booking)} />
    </form>
  </div>
</Modal>
