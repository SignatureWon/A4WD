<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { html } from "$lib/email/quotation.js";
  import { q } from "$lib/quote.js";
  import Trip from "$lib/vehicles/Trip.svelte";
  import Customer from "$lib/vehicles/view/Customer.svelte";
  import Driver from "$lib/vehicles/Driver.svelte";
  import Passenger from "$lib/vehicles/Passenger.svelte";
  import Daily from "$lib/vehicles/Daily.svelte";
  import Adjustments from "$lib/vehicles/Adjustments.svelte";
  import Specials from "$lib/vehicles/Specials.svelte";
  import Bonds from "$lib/vehicles/Bonds.svelte";
  import Fees from "$lib/vehicles/view/Fees.svelte";
  import Addons from "$lib/vehicles/Addons.svelte";
  import Summary from "$lib/vehicles/Summary.svelte";
  import { onMount } from "svelte";
  import { Button, Loading, Modal, TextArea, ToastNotification, Toggle } from "carbon-components-svelte";
  import { calculator } from "$lib/calculator";
  import Toast from "$lib/components/admin/Toast.svelte";
  export let data;

  let pageload = false;
  let pageCompleted = 0;
  let quote = data.quote;
  let summary = {
    agentItems: [],
    supplierItems: [],
    pickupItems: [],
    termsItems: [],
    totalAgent: 0,
    totalCommission: 0,
    totalSupplier: 0,
    totalAgentAdjustments: 0,
    totalSupplierAdjustments: 0,
  };

  console.log("quote", quote);

  let open = false;
  let openEmail = false;
  let emailPreview = "";

  const getSummary = () => {
    summary = q.getPayments(quote);
    quote.agent_fee = summary.totalAgent;
    quote.supplier_fee = summary.totalSupplier;
    quote.profit = summary.totalCommission;
    quote.nett = summary.totalNett;
    // console.log("summary", summary);
    // console.log("quote", quote);
  };

  const regenerateQuote = async () => {
    pageload = true;
    let search = {
      // rates: quote.details.rates.id,
      type: quote.details.rates.type,
      vehicle: quote.details.vehicle.id,
      pickup: quote.details.pickup.id,
      dropoff: quote.details.dropoff.id,
      date_start: quote.details.date_start,
      date_end: quote.details.date_end,
      license: quote.details.license.id || "",
      age: quote.details.age.id,
      pax: Number(quote.details.pax),
      duration: Number(quote.details.duration),
    };
    // console.log("search", search);
    let details = await calculator.single(search);

    quote.details = { ...quote.details, ...details };

    // console.log("quote", quote);

    if (Object.keys(quote.details.bonds).length === 0) {
      quote.details.bonds = quote.details.bond_items[0];
    }

    getSummary();

    pageload = false;
    pageCompleted = true;
    setTimeout(() => {
      pageCompleted = false;
    }, 2000);

    // summary = q.getPayments(quote);
  };

  onMount(async () => {
    getSummary();
  });

  let paneHeight = 0;
</script>

<svelte:window bind:innerHeight={paneHeight} />

<Toast />
{#if pageload}
  <Loading />
{/if}
{#if pageCompleted}
  <ToastNotification lowContrast kind="success" title="Quote regenerated" class="fixed top-1 right-1 z-[9999]" />
{/if}

<div class="pr-80">
  <PageTitle title="{q.prefix[quote.status]}{388000 + quote.id}" path={data.path} id={data.id} />
  <div class="overflow-y-auto" style="height: {paneHeight - 170}px">
    <div class="bg-white rounded mb-4">
      <Trip bind:quote />
      <Customer bind:quote />
      <div class="grid grid-cols-1 md:grid-cols-2">
        <Driver bind:quote />
        <Passenger bind:quote />
      </div>
    </div>
    <Daily bind:quote count={getSummary} />
    <div class="bg-white rounded mb-4">
      <Specials bind:quote />
      <Adjustments bind:quote count={getSummary} />
    </div>
    <Bonds bind:quote count={getSummary} />
    <div class="bg-white rounded mb-4">
      <Fees bind:quote />
      <Addons bind:quote count={getSummary} />
    </div>
  </div>
</div>
<aside class="h-screen w-80 bg-brand-100 fixed top-0 right-0 pt-12 pb-64 overflow-y-auto">
  <Summary bind:quote bind:summary count={getSummary} />
  <div class="fixed bottom-0 right-0 bg-brand-200 w-80 p-4">
    <div class="grid grid-cols-2 gap-1">
      <form action="?/update" method="POST">
        <Button type="submit" class="w-full">Update</Button>
        <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      </form>
      <form action="?/duplicate" method="POST">
        <Button type="submit" kind="tertiary" class="w-full">Duplicate</Button>
        <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      </form>
    </div>
    <div class="grid grid-cols-3 gap-1 my-2">
      <div>PDF</div>
      <div>
        <form action="?/download" method="POST">
          <Button kind="tertiary" class="p-0.5 h-6 w-full">Generate</Button>
        </form>
      </div>
      <div>
        <Button
          class="p-0.5 h-6 w-full inline-block"
          href="https://api.australia4wdrentals.com/storage/v1/object/public/quotes/Q{388000 + quote.id}.pdf"
          >Download</Button
        >
      </div>
    </div>
    <div class="grid grid-cols-3 gap-1 mb-2">
      <div>Quote</div>
      <div>
        <Button
          kind="tertiary"
          class="p-0.5 h-6 w-full"
          on:click={async () => {
            emailPreview = await html.create(quote.id);
            open = true;
          }}>Preview</Button
        >
      </div>
      <div style="text-transform: capitalize;">
        <Button
          class="p-0.5 h-6 w-full"
          on:click={() => {
            openEmail = true;
          }}>Email</Button
        >
      </div>
    </div>
    <form action="?/book" method="POST">
      <Button type="submit" class="w-full">Proceed to Book</Button>
    </form>
    <div class="grid grid-cols-3 gap-1 mt-2">
      <div>Move</div>
      <div>
        <form action="?/trash" method="POST">
          <Button type="submit" kind="tertiary" class="p-0.5 h-6 w-full">Trash</Button>
        </form>
      </div>
      <div style="text-transform: capitalize;">
        <form action="?/archive" method="POST">
          <Button type="submit" kind="tertiary" class="p-0.5 h-6 w-full">Archive</Button>
        </form>
      </div>
    </div>
    <div class="mt-2" style="text-transform: capitalize;">
      <Button kind="tertiary" class="p-0.5 h-6 w-full" on:click={regenerateQuote}>Regenerate Quote</Button>

      <!-- <form action="?/regenerate" method="POST">
        <Button type="submit" kind="tertiary" class="p-0.5 h-6 w-full">Regenerate Quote</Button>

      </form> -->
    </div>
  </div>
</aside>
<Modal passiveModal bind:open={openEmail} modalHeading="Email Quote" on:open on:close>
  <form action="?/email" method="POST">
    <TextArea labelText="Message" name="message" class="mb-2" placeholder="Add message here" />
    <Toggle name="a4only" labelText="Send to" labelA="Everyone" labelB="A4 only" />
    <Button type="submit" class="w-full">Send</Button>
  </form>
</Modal>
<Modal passiveModal bind:open modalHeading="Preview" on:open on:close>
  <div id="htmlcontent">
    {@html emailPreview}
  </div>
</Modal>
