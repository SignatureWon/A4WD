<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { q } from "$lib/quote.js";
  import Trip from "$lib/vehicles/Trip.svelte";
  import Customer from "$lib/vehicles/view/Customer.svelte";
  import Driver from "$lib/vehicles/Driver.svelte";
  import Passenger from "$lib/vehicles/Passenger.svelte";
  import Daily from "$lib/vehicles/Daily.svelte";
  export let data;

  let quote = data.quote;
  console.log(quote);
  let paneHeight = 0;
</script>

<svelte:window bind:innerHeight={paneHeight} />

<div class="pr-80">
  <PageTitle title="{q.prefix[quote.status]}{388000 + quote.id}" path={data.path} id={data.id} />
  <div class="overflow-y-auto" style="height: {paneHeight - 170}px">
    <div class="bg-white rounded mb-4">
      <Trip {quote} />
      <Customer user={quote.users} />
      <Driver bind:quote />
      <Passenger bind:quote />
    </div>
    <Daily {quote} />

    <div class="bg-white p-4 h-screen">
      <div class="">
        <div class="p-4">body</div>
      </div>
    </div>
  </div>
</div>
<aside class="h-screen w-80 bg-brand-100 fixed top-0 right-0 pt-16 overflow-y-auto">
  aside
  <div class="h-screen">h</div>
  <div class="h-screen">h</div>
</aside>
