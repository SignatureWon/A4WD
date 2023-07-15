<script>
  import { onMount } from "svelte";
  import Search from "../Search.svelte";
  import Action from "./Action.svelte";
  import Bonds from "./Bonds.svelte";
  import Daily from "./Daily.svelte";
  import Fees from "./Fees.svelte";
  import Payments from "./Payments.svelte";
  import Specials from "./Specials.svelte";
  import Trip from "./Trip.svelte";
  import { q } from "$lib/quote.js";
  export let data;
  // console.log(data);
  // let quote = {
  //   status: "Request",
  //   details: {
  //     ...data.details,
  //     driver: {
  //       age: null,
  //       license: data.search.license,
  //     },
  //     passenger: {
  //       adult: 1,
  //       children: 0,
  //     },
  //   },
  //   users: {
  //     email: null,
  //   },
  // };

  let quote = {
    details: data.details,
  };
  let summary = {
    agentItems: [],
    supplierItems: [],
    pickupItems: [],
    termsItems: [],
    totalAgent: 0,
    totalCommission: 0,
    totalSupplier: 0,
  };
  const count = () => {
    summary = q.getPayments(quote);
    quote.agent_fee = summary.totalAgent;
    quote.supplier_fee = summary.totalSupplier;
    quote.profit = summary.totalCommission;
    quote.nett = summary.totalNett;
  };
  onMount(() => {
    // console.log(quote);
    count();
  });
</script>

<Search options={data.options} search={data.search} />
<section class="container xl:max-w-7xl mx-auto p-4">
  <Trip {quote} />
  <Daily data={quote.details} />
  <Specials data={quote.details} />
  <Bonds bind:data={quote.details} search={data.search} {count} />
  <Fees data={quote.details} search={data.search} {count} />
  <Payments {quote} {summary} />
  <Action {quote} />
</section>
