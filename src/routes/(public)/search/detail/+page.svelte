<script>
  import { supabase } from "$lib/supabaseClient";
  import {
    Button,
    Checkbox,
    Modal,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";
  import { pdf } from "$lib/pdf.js";
  export let data;

  const d = data.detail;
  // console.log(data);

  const formatCurrency = (num) => {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  let guest = {
    name: "John",
    email: "john@email.com",
    phone: "01234567890",
    country: "australia",
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
  };

  // console.log(data.detail);

  let open = false;
  let showFeeDetails = false;

  let selected_bond = 0;
  let bond_fee = 0;
  if (d.bond_items.length) {
    bond_fee =
      d.bond_items[0].gross *
      (d.duration < (d.bond_items[0].cap || 0)
        ? d.duration
        : d.bond_items[0].cap || 0);
    booking.bond = d.bond_items[0];
  }
  // console.log(booking);
  let addon_fee = 0;
  let total =
    d.gross + d.one_way + d.fee_total + bond_fee + addon_fee - d.special_total;

  let modalSendQuote = false;

  $: total =
    d.gross + d.one_way + d.fee_total + bond_fee + addon_fee - d.special_total;
</script>

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
  <div class="p-2">
    <div class="p-2">
      <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
        Accident Liability
      </div>
      <div>Select your level of liability from the options below</div>
    </div>
    <div class="flex">
      {#each d.bond_items as b, i}
        <div
          class="border {selected_bond === i
            ? 'border-brand-600 bg-brand-50'
            : 'border-gray-200'} p-3 flex-1 flex flex-col m-2"
        >
          <div class="flex-1 pb-8">
            <h4 class="font-bold text-brand-600">{b.display_name}</h4>
            <div class="text-xl font-bold">
              AUD ${formatCurrency(
                (b.gross || 0) *
                  (b.cap
                    ? b.cap > d.duration
                      ? b.cap
                      : d.duration
                    : d.duration)
              )}
            </div>
            <div class="mb-4">
              ${formatCurrency(b.gross || 0)} x {b.cap
                ? b.cap > d.duration
                  ? b.cap
                  : d.duration
                : d.duration} days
            </div>
            <div class="mb-4 font-bold">
              ${b.liability.toLocaleString("en-US")} Excess<br />
              ${b.bond.toLocaleString("en-US")} Bond
            </div>
            {#if b.description}
              <div class="mb-4 text-gray-500">
                {b.description}
              </div>
            {/if}
            {#if b.inclusions}
              <div class="font-bold">Inclusions</div>
              {b.inclusions}
            {/if}
          </div>
          {#if selected_bond === i}
            <Button>Selected</Button>
          {:else}
            <Button
              kind="ghost"
              on:click={() => {
                selected_bond = i;
                bond_fee =
                  b.gross *
                  (d.duration < (b.cap || 0) ? d.duration : b.cap || 0);
                booking.bonds = b;
                console.log(booking);
              }}>Select</Button
            >
          {/if}
        </div>
      {/each}
    </div>
  </div>
  {#if d.addon_items.length}
    <div class="p-4">
      <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
        <div>Add-ons</div>
        <div>AUD $</div>
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
    <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
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
  <div class="text-xl font-bold text-center mb-4">
    Book now with ${formatCurrency(
      d.terms.percentage ? (total * d.terms.deposit) / 100 : d.terms.deposit
    )} deposit only
  </div>
  <div class="grid grid-cols-2">
    <Button
      size="small"
      kind="tertiary"
      on:click={async (e) => {
        await pdf.generate_pdf(guest, booking, "Quotation")
        // var pdfFile = new Blob(
        //   [pdf.generate_pdf(guest, booking, "Quotation")],
        //   {
        //     type: "application/pdf",
        //   }
        // );
        // const { data: dataPdf, error: errPdf } = await supabase.storage
        //   .from("quotes")
        //   .update("sample.pdf", pdfFile);
        // let pdfout = pdf.generate_pdf(guest, booking, "Quotation")
        // const
        // modalSendQuote = true;
      }}>Email Quote</Button
    >
    <Button size="small" href="/search/details">Book Now</Button>
  </div>
</section>

<Modal
  bind:open={modalSendQuote}
  modalHeading="Send quote to my email"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit={pdf.generate_pdf(guest, booking, "Quotation")}
>
  <div class="max-w-md mx-auto mt-10">
    <TextInput labelText="Name" bind:value={guest.name} class="mb-5" />
    <TextInput labelText="Email" bind:value={guest.email} class="mb-5" />
    <TextInput labelText="Phone" bind:value={guest.phone} class="mb-5" />
    <Select labelText="Country" bind:value={guest.country}>
      {#each data.countries as country}
        <SelectItem value={country.name} />
      {/each}
    </Select>
  </div>
</Modal>
