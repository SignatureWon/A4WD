<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  // import Form from "$lib/components/admin/Form.svelte";
  // import FormSection from "$lib/components/admin/FormSection.svelte";
  // import InputText from "$lib/components/admin/InputText.svelte";
  // import InputSelect from "$lib/components/admin/InputSelect.svelte";
  // import { enhance } from "$app/forms";
  import { html } from "$lib/html.js";
  import { html as final } from "$lib/final.js";
  // import { jsPDF } from "jspdf";
  import { q } from "$lib/quote.js";

  import {
    Button,
    Checkbox,
    InlineNotification,
    Modal,
    NumberInput,
    RadioButton,
    RadioButtonGroup,
    Select,
    SelectItem,
    TextArea,
    TextInput,
    Toggle,
  } from "carbon-components-svelte";
  import { format } from "$lib/format.js";
  import { env } from "$env/dynamic/public";
  import { bind, onMount } from "svelte/internal";
  import dayjs from "dayjs";
  import Trip from "$lib/admin/quote/Trip.svelte";
  import SupplierReference from "$lib/admin/quote/SupplierReference.svelte";
  import Customer from "$lib/admin/quote/Customer.svelte";
  import Driver from "$lib/admin/quote/Driver.svelte";
  import Section from "$lib/admin/quote/Section.svelte";
  import Passenger from "$lib/admin/quote/Passenger.svelte";
  import FeeDaily from "$lib/admin/quote/FeeDaily.svelte";
  import FeeBond from "$lib/admin/quote/FeeBond.svelte";
  import FeeAddons from "$lib/admin/quote/FeeAddons.svelte";
  import FeeOthers from "$lib/admin/quote/FeeOthers.svelte";
  import FeeSpecials from "$lib/admin/quote/FeeSpecials.svelte";
  import FeeAdjustments from "$lib/admin/quote/FeeAdjustments.svelte";
  import FeePayment from "$lib/admin/quote/FeePayment.svelte";
  import BookingDetails from "$lib/admin/quote/BookingDetails.svelte";

  export let data;

  // console.log("data", data);
  let paneHeight = 0;
  const d = data.detail;
  let details = data.quote.details;
  let selected_bond = 0;
  let bond_fee = 0;
  if (!d.bond_items) {
    d.bond_items = [];
  }
  if (d.bond_items.length) {
    bond_fee =
      d.bond_items[0].gross * (d.duration < (d.bond_items[0].cap || 0) ? d.duration : d.bond_items[0].cap || 0);
  }
  let selected_addons = [];

  let addon_fee = 0;
  let noCustomer = false;
  let user = data.user;
  let quote = data.quote;

  // console.log(summary);

  const duration = details.duration;
  const date_quote = dayjs().format("DD MMM YYYY");
  const date_start = dayjs(details.date_start).format("ddd, DD MMM YYYY");
  const date_end = dayjs(details.date_end).format("ddd, DD MMM YYYY");
  let agentFees = [];
  let supplierFees = [];
  let pickupFees = [];
  let totalPickupFees = 0;

  let fees = {
    daily: [],
    bond: {},
    addons: {},
    others: [],
  };
  let fee_discount = {
    daily: {
      name: "",
      value: 0,
    },
    specials: [],
  };

  // map data
  const info = {
    quote: {
      date: date_quote,
      duration: duration,
      pickup: {
        name: details.pickup.name,
        date: date_start,
      },
      dropoff: {
        name: details.dropoff.name,
        date: date_end,
      },
    },
    vehicle: {
      name: d.vehicle_name,
      slug: d.vehicle_slug,
      image: d.vehicle_image,
    },
  };

  let summary = {};
  const countFees = () => {
    summary = q.getPayments(quote);

    quote.gross = 0;
    quote.nett = 0;
    quote.profit = 0;
    // quote.add_discount = 0;
    quote.discount = 0;
    quote.discount_agent = 0;
    quote.receivables = 0;
    quote.cc_fee = 0;
    quote.system_fee = 0;
    quote.nett_profit = 0;

    // daily
    fees.daily.forEach((obj) => {
      quote.gross += obj.total;
      quote.nett += obj.nett;
      quote.profit += obj.profit;
    });

    // bond
    quote.gross += fees.bond.total;
    quote.nett += fees.bond.nett;
    quote.profit += fees.bond.profit;

    // addons
    for (const key in fees.addons) {
      let obj = fees.addons[key];
      quote.gross += obj.total;
      quote.nett += obj.nett;
      quote.profit += obj.profit;
    }

    // others
    fees.others.forEach((obj) => {
      quote.gross += obj.total;
      quote.nett += obj.nett;
      quote.profit += obj.profit;
    });

    // discount
    // quote.add_discount += fee_discount.daily.value;

    // specials
    fee_discount.specials.forEach((obj) => {
      quote.discount -= obj.total;
    });

    // adjustment
    if (!quote.adjustments) {
      quote.adjustments = [];
    }
    quote.adjustments.forEach((obj) => {
      if (obj.own) {
        quote.discount_agent += obj.value;
        quote.profit += obj.value;
      } else {
        quote.discount += obj.value;
      }
      // quote.gross += obj.value;
      // quote.nett += obj.value;
    });

    // quote.discount_agent += obj.value
    quote.discount_agent += quote.add_discount;

    quote.cc_fee = quote.cc_charge ? (quote.gross + quote.discount + quote.discount_agent) * 0.02 : 0;
    quote.receivables = quote.gross + quote.discount + quote.discount_agent + quote.cc_fee;

    quote.profit += quote.add_discount;
    quote.system_fee = quote.profit * 0.08;
    quote.nett_profit = quote.profit - quote.system_fee;
  };

  let open = false;
  let openEmail = false;

  let emailPreview = "";
  // let summary = q.getPayments(quote);

  onMount(() => {
    countFees();
  });

  let ticketAction = "";

  // countFees();

  // $: countFees()
</script>

<svelte:window bind:innerHeight={paneHeight} />

<PageTitle title="Q{388000 + data.quote.id}" path={data.path} id={data.id} />
<div class="flex bg-white" style="height: {paneHeight - 190}px">
  <div class="flex-1 h-full overflow-y-auto">
    <div class="p-5">
      <Section title="Trip Details">
        <Trip {info} />
        <SupplierReference bind:reference={quote.supplier_reference} />
        <BookingDetails bind:quote />
      </Section>
      <Section title="Customer Details">
        <Customer {user} />
      </Section>
      <Section title="Driver's Details">
        <Driver licenseOptions={data.options.licenses} bind:driver={details.driver} />
      </Section>
      <Section title="Passenger Details">
        <Passenger passenger={details.passenger} />
      </Section>
      <Section title="Daily basic rental">
        <FeeDaily bind:fees={fees.daily} daily={details.daily} type={details.rates_type} bind:quote count={countFees} />
      </Section>
      <Section title="Adjustments">
        <FeeAdjustments bind:adjustments={quote.adjustments} count={countFees} />
      </Section>
      <Section title="Specials">
        <FeeSpecials bind:fees={fee_discount.specials} specials={details.specials} />
      </Section>
      <Section title="Bond Options">
        <FeeBond
          bind:fees={fees.bond}
          list={d.bond_items}
          bind:bonds={details.bonds}
          bind:selected={selected_bond}
          duration={d.duration}
          count={countFees}
        />
      </Section>
      <Section title="Other Fees">
        <FeeOthers bind:fees={fees.others} one_way={details.one_way} others={details.fees} />
      </Section>
      <Section title="Add-ons">
        <FeeAddons
          bind:fees={fees.addons}
          bind:addons={details.addons}
          list={d.addon_items}
          duration={d.duration}
          count={countFees}
          bind:bond={selected_bond}
        />
      </Section>
      <Section title="Payment Information">
        <FeePayment bind:quote />
      </Section>
    </div>
  </div>
  <div class="h-full w-80 overflow-y-auto bg-brand-50">
    <div class="overflow-y-auto" style="height: {paneHeight - 370}px">
      <div class="p-5 text-sm">
        <h2 class="text-xl font-bold mb-2">Quote Summary</h2>
        {#each summary.agentItems as item}
          {#if item.name === "Credit card surcharge (2%)"}
            <div class="flex py-2 border-b border-gray-200">
              <div class="flex-1 relative">
                <Toggle
                  labelA=""
                  labelB=""
                  size="sm"
                  bind:toggled={quote.cc_charge}
                  on:toggle={countFees}
                  class="absolute -mt-1.5"
                />
                <div class="pl-10">{@html item.name}</div>
              </div>
              <div class="text-right ml-4">{format.currency(item.total)}</div>
            </div>
          {:else if item.name === "Credit card surcharge (WAIVED)"}
            <div class="flex py-2 border-b border-gray-200">
              <div class="flex-1 relative">
                <Toggle
                  labelA=""
                  labelB=""
                  size="sm"
                  bind:toggled={quote.cc_charge}
                  on:toggle={countFees}
                  class="absolute -mt-1.5"
                />
                <div class="pl-10">{@html item.name}</div>
              </div>
              <div class="text-right ml-4">{format.currency(item.total)}</div>
            </div>
          {:else}
            <div class="flex py-2 border-b border-gray-200">
              <div class="flex-1">
                {@html item.name}
              </div>
              <div class="text-right ml-4">{format.currency(item.total)}</div>
            </div>
          {/if}
        {/each}

        <div class="flex py-2 border-b border-gray-200 font-bold bg-brand-200">
          <div class="flex-1">Total payable to agent</div>
          <div class="text-right ml-4">{format.currency(summary.totalAgent)}</div>
        </div>
        {#each summary.supplierItems as item}
          <div class="flex py-2 border-b border-gray-200">
            <div class="flex-1">
              {@html item.name}
            </div>
            <div class="text-right ml-4">{format.currency(item.total)}</div>
          </div>
        {/each}
        <div class="flex py-2 border-b border-gray-200 font-bold bg-brand-200">
          <div class="flex-1">Total payable to supplier</div>
          <div class="text-right ml-4">{format.currency(summary.totalSupplier)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Nett</div>
          <div class="text-right ml-4">{format.currency(quote.nett || 0)}</div>
        </div>
        <div class="flex py-2 border-b border-gray-200">
          <div class="flex-1">Total Profit</div>
          <div class="text-right ml-4">{format.currency(quote.profit || 0)}</div>
        </div>
      </div>
    </div>
    <div class="p-4">
      <form action="?/update" method="POST">
        <Button type="submit" class="w-full">Update Quote</Button>
        <!-- <Button
          on:click={() => {
            console.log(quote);
          }}
          class="w-full"
        >
          Update Quote
        </Button> -->
        <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      </form>
      <!-- <div class="pt-2 grid grid-cols-2 gap-2">
        <div>
          <Button
            kind="tertiary"
            on:click={async () => {
              emailPreview = await html.create(quote.id, "template_quote");
              open = true;
            }}
            class="p-0.5 h-6 w-full">Preview Quote</Button
          >
        </div>
        <div>
          <form action="?/download" method="POST">
            <Button kind="tertiary" type="submit" class="p-0.5 h-6 w-full">Generate PDF</Button>
          </form>
        </div>
        <div>
          <Button
            kind="tertiary"
            href="https://api.australia4wdrentals.com/storage/v1/object/public/quotes/Q{388000 + quote.id}.pdf"
            target="_blank"
            class="p-0.5 h-6 w-full block">Download PDF</Button
          >
        </div>
        <div>
          <Button
            kind="tertiary"
            class="p-0.5 h-6 w-full"
            on:click={() => {
              openEmail = true;
            }}>Email Quote</Button
          >
        </div>
      </div> -->
    </div>
    <div class="p-4 bg-brand-200">
      <div>
        <Button
          kind="tertiary"
          on:click={async () => {
            emailPreview = await final.create(quote.id);
            open = true;
          }}
          class="w-full mb-2">Preview Final Ticket</Button
        >
      </div>
      <div>
        <Button
          class="w-full"
          on:click={() => {
            openEmail = true;
          }}>Email Final Ticket</Button
        >
      </div>
    </div>
  </div>
</div>

<Modal passiveModal bind:open={openEmail} modalHeading="Email Final Ticket" on:open on:close>
  <form action="?/email" method="POST">
    <TextArea labelText="Message" name="message" class="mb-2" placeholder="Add message here" />
    <Button type="submit" class="w-full">Send</Button>
  </form>
</Modal>
<Modal passiveModal bind:open modalHeading="Preview" on:open on:close>
  <!-- <div class="fixed">
    <Button
      on:click={async () => {
        const doc = new jsPDF();
        // const elem = document.getElementById("htmlcontent");
        doc.html(document.getElementById("htmlcontent"), {
          callback: function (doc) {
            doc.save("Generated.pdf");
          },
          x: 15,
          y: 15,
          width: 180, //target width in the PDF document
          windowWidth: 650, //window width in CSS pixels
          pagesplit: true,
        });
        // await doc
        //         .html(elem, 15, 15, {
        //           width: 170,
        //           //   elementHandlers: specialElementHandlers,
        //         })
        //         .save("test.pdf");
      }}>DOWNLOAD</Button
    >
  </div>
  <div class="pt-20"> -->
  <div id="htmlcontent">
    {@html emailPreview}
  </div>
  <!-- </div> -->
</Modal>
