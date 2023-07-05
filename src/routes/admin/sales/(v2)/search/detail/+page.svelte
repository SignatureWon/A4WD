<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Search from "../../../../../(public)/search2/Search.svelte";
  import Action from "./Action.svelte";
  import Bonds from "./Bonds.svelte";
  import Daily from "./Daily.svelte";
  import Fees from "./Fees.svelte";
  import Payments from "./Payments.svelte";
  import Specials from "./Specials.svelte";
  import Trip from "./Trip.svelte";
  import { q } from "$lib/quote.js";
  import Summary from "$lib/vehicles/Summary.svelte";
  // import Summary from "./Summary.svelte";
  import Customer from "./Customer.svelte";
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Driver from "$lib/vehicles/Driver.svelte";
  import Passenger from "$lib/vehicles/Passenger.svelte";
  import { Button, Modal } from "carbon-components-svelte";
  import { html } from "$lib/email/quotation.js";

  export let data;
  // console.log("data", data);
  let open = false;
  let emailPreview = "";
  let error_message = []

  let quote = {
    id: 0,
    status: "Request",
    details: {
      ...data.details,
      driver: {
        age: null,
        license: null,
      },
      passenger: {
        adult: 1,
        children: 0,
      },
    },
    users: {
      id: null,
      title: null,
      first_name: null,
      last_name: null,
      phone: null,
      email: null,
      address_1: null,
      address_2: null,
      postcode: null,
      city: null,
      state: null,
      country: null,
    },
  };
  // console.log(quote);
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
  const createQuote = async () => {
    // let valid = true
      // console.log("quote", quote);
    error_message = []
    if (!quote.users.id) {
      error_message.push("No selected user")
    }
    if (!quote.details.driver.license.length) {
      error_message.push("No driver license")
    }
    if (!quote.details.driver.age || quote.details.driver.age === 0) {
      error_message.push("No driver age")
    }
    if (!quote.details.passenger.adult === 0) {
      error_message.push("No adult passenger")
    }
    if (error_message.length === 0) {
      let newQuote = {...quote}
      newQuote.users = quote.users.id;
      delete newQuote.id

      const { data, error } = await supabase.from("quotes").insert(newQuote).select().single();
      setTimeout(() => {
        goto(`/admin/sales/quotes/${data.id}`);
      }, 500);
  }
  };

  const count = () => {
    summary = q.getPayments(quote);
    quote.agent_fee = summary.totalAgent;
    quote.supplier_fee = summary.totalSupplier;
    quote.profit = summary.totalCommission;
    quote.nett = summary.totalNett;
  };
  onMount(() => {
    count();
  });
  let paneHeight = 0;
</script>

<!-- <Search options={data.options} search={data.search} /> -->
<div class="pr-80">
  <!-- <PageTitle title="{q.prefix[quote.status]}{388000 + quote.id}" path={data.path} id={data.id} /> -->
  <div class="overflow-y-auto" style="height: {paneHeight - 170}px">
    <div class="bg-white rounded mb-4">
      <Trip bind:quote />
      <Customer bind:quote options={data.options} />
      <div class="grid grid-cols-1 md:grid-cols-2">
        <Driver bind:quote />
        <Passenger bind:quote />
      </div>
    </div>
    <Daily data={quote.details} />
    <Specials data={quote.details} />
    <Bonds bind:data={quote.details} search={data.search} {count} />
    <Fees bind:data={quote.details} search={data.search} {count} />
  </div>
</div>
<aside class="h-screen w-80 bg-brand-100 fixed top-0 right-0 pt-12 pb-60 overflow-y-auto">
  <Summary bind:quote bind:summary {count} />
  <div class="fixed bottom-0 right-0 bg-brand-200 w-80 p-4">
    {#if error_message.length}
      <div class="mb-2 text-sm">
        {#each error_message as item}
          <div>{item}</div>
        {/each}
      </div>
    {/if}
    <div class="grid grid-cols-1 gap-1">
      <Button
        kind="tertiary"
        class="w-full"
        on:click={async () => {
          emailPreview = await html.create(quote);
          open = true;
        }}>Preview</Button
      >

      <Button
        class="w-full"
        on:click={createQuote}>Create Quote</Button
      >

      <!-- <form action="?/update" method="POST">
        <Button type="submit" class="w-full">Update</Button>
        <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      </form>
      <form action="?/duplicate" method="POST">
        <Button type="submit" kind="tertiary" class="w-full">Duplicate</Button>
        <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      </form> -->
    </div>
    <!-- <div class="grid grid-cols-3 gap-1 my-3">
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
    </div> -->
    <!-- <div class="grid grid-cols-3 gap-1 mb-3">
      <div>Quote</div> -->
    <!-- <div>
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
    </div> -->
    <!-- <form action="?/book" method="POST">
        <Button type="submit" class="w-full">Create Quote</Button>
      </form> -->
    <!-- <div class="grid grid-cols-3 gap-1 mt-3">
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
    </div> -->
    <!-- </div> -->
  </div>
</aside>
<Modal passiveModal bind:open modalHeading="Preview" on:open on:close>
  <div id="htmlcontent">
    {@html emailPreview}
  </div>
</Modal>

<!-- <section class="container xl:max-w-7xl mx-auto p-4">
  <Trip data={quote.details} />
  <Daily data={quote.details} />
  <Specials data={quote.details} />
  <Bonds bind:data={quote.details} search={data.search} {count} />
  <Fees data={quote.details} search={data.search} {count} />
  <Payments data={quote.details} search={data.search} /> -->

<!-- <Summary bind:quote bind:summary {count} /> -->
<!-- <Customer options={data.options} /> -->
<!-- <Action {quote} /> -->
<!-- </section> -->
