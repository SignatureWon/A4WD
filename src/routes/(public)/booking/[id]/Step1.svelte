<script>
  import dayjs from "dayjs";
  import { format } from "$lib/format.js";
  import { html as quotation } from "$lib/html.js";
  import { q } from "$lib/quote.js";
  import { onMount } from "svelte";
  import { Button, Modal } from "carbon-components-svelte";
  export let quote;
  let open = false;
  let summary = {
    agentItems: [],
    supplierItems: [],
    pickupItems: [],
    termsItems: [],
    totalAgent: 0,
    totalCommission: 0,
    totalSupplier: 0,
  };

  onMount(async () => {
    summary = q.getPayments(quote);
  });
  const iconRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" /></svg>`;
</script>

<div class="bg-white rounded mb-4">
  <div class="p-5 border-b border-gray-200">
    <h2 class="h2">Step 1: Check Booking Details</h2>
    <div class="text-gray-500">
      Please ensure that your booking details are correct. If you have any enquiries or if you need to make changes,
      please contact us and refer to the quotation we sent to you.
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2">
    <div class="p-5">
      <div class="grid grid-cols-1 gap-5">
        <div>
          <div class="label">Quote Reference</div>
          <div class="flex items-center mb-2">
            <div class="h2">Q{quote.id + 388000}</div>
            <Button
              kind="ghost"
              on:click={async () => {
                open = true;
              }}
            >
              View Quote
            </Button>
          </div>
          <div class="text-sm text-gray-500 p-3 bg-gray-100">
            Quote this reference number when requesting support or information over the phone or via email.
          </div>
        </div>
        <div>
          <div class="label">Quote Total</div>
          <div class="value mb-2">AUD ${format.currency(summary.totalAgent + summary.totalSupplier)}</div>
        </div>
        <div>
          <div class="label">Pay to Agent</div>
          <div>
            {#each summary.termsItems as item}
              <div class="flex pb-4 mb-3 border-b border-gray-200">
                <div class="flex-1">{@html item.name}</div>
                <div class="w-20 text-right ml-5">${format.currency(item.total)}</div>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <div class="label">Pay at Pick-up</div>
          <div>
            {#each summary.pickupItems as item}
              <div class="flex pb-4 mb-3 border-b border-gray-200">
                <div class="flex-1">{@html item.name}</div>
                <div class="w-20 text-right ml-5">${format.currency(item.total)}</div>
              </div>
            {/each}
          </div>
        </div>
        <div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div class="label">Driver's license</div>
              <div class="value">{quote.details.driver.license}</div>
            </div>
            <div>
              <div class="label">Driver's age</div>
              <div class="value">{quote.details.driver.age}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div class="label">No. of Adult</div>
              <div class="value">{quote.details.passenger.adult}</div>
            </div>
            <div>
              <div class="label">No. of Children</div>
              <div class="value">{quote.details.passenger.children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5">
      <div class="p-5 bg-gray-100 text-sm">
        <h2 class="h2 mb-3">Rental Details</h2>
        <div class="grid grid-cols-1 divide-y divide-gray-300">
          <div class="md:flex mb-5">
            <div class="md:w-1/4">
              <img src={quote.details.vehicle.image} alt={quote.details.vehicle.name} class="rounded" />
            </div>
            <div class="md:flex-1 ml-5">
              <div class="label">Vehicle</div>
              <div class="value">{quote.details.vehicle.name}</div>
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5 py-1.5">
            <div>Pick-up</div>
            <div class="col-span-2 text-right">
              {quote.details.pickup.name} - {dayjs(quote.details.date_start).format("ddd, DD/MM/YYYY")}
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5 py-1.5">
            <div>Drop-off</div>
            <div class="col-span-2 text-right">
              {quote.details.dropoff.name} - {dayjs(quote.details.date_end).format("ddd, DD/MM/YYYY")}
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5 py-1.5">
            <div>Duration</div>
            <div class="col-span-2 text-right">
              {quote.details.duration} days
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5 py-1.5">
            <div>Passengers</div>
            <div class="col-span-2 text-right">
              {quote.details.passenger.adult} adult, {quote.details.passenger.children} children
            </div>
          </div>
          <div class="grid grid-cols-3 gap-5 py-1.5">
            <div>License</div>
            <div class="col-span-2 text-right">
              {quote.details.driver.license}
            </div>
          </div>
        </div>
        <h2 class="h2 mt-4">Rental Costs</h2>
        <div class="grid grid-cols-1 divide-y divide-gray-300">
            {#each summary.agentItems as item}
            <div class="grid grid-cols-3 gap-5 py-1.5">
              <div class="col-span-2">{@html item.name}</div>
              <div class="text-right">
                ${format.currency(item.total)}
              </div>
            </div>
          {/each}
          <div class="grid grid-cols-3 gap-5 py-1.5 pb-4">
            <div class="col-span-2 font-bold">Total payable to agent</div>
            <div class="text-right font-bold">
              ${format.currency(summary.totalAgent)}
            </div>
          </div>
          {#each summary.supplierItems as item}
            <div class="grid grid-cols-3 gap-5 py-1.5">
              <div class="col-span-2">{@html item.name}</div>
              <div class="text-right">
                ${format.currency(item.total)}
              </div>
            </div>
          {/each}
          <div class="grid grid-cols-3 gap-5 py-1.5">
            <div class="col-span-2 font-bold">Total payable to supplier</div>
            <div class="text-right font-bold">
              ${format.currency(summary.totalSupplier)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<Modal passiveModal bind:open modalHeading="View Quote" on:open on:close>
  <div id="htmlcontent">
    {#await quotation.create(quote.id, "template_quote") then value}
      {@html value}
    {/await}
  </div>
</Modal>
