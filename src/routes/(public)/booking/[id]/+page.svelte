<script>
  import { Button, InlineNotification, Modal, Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";
  import { html as quotation } from "$lib/html.js";
  let open = false;

  import Trip from "$lib/vehicles/Trip.svelte";
  import Customer from "$lib/vehicles/Customer.svelte";
  import Driver from "$lib/vehicles/Driver.svelte";
  import Passenger from "$lib/vehicles/Passenger.svelte";
  import Payment from "$lib/vehicles/Payment.svelte";

  export let data;
  // console.log(data.quote);
</script>

{#if !data.quote}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No booking detail</div>
      <Button href="/">Back to home</Button>
    </div>
  </div>
{:else}
  <div class="mx-auto max-w-3xl p-4">
    <div class="bg-white rounded">
      <div class="p-4 border-b border-gray-200">
        <h1 class="h1">Vehicle Booking Request</h1>
      </div>
      <div class="p-4">
        <div class="label">Reference Number</div>
        <div class="flex items-center">
          <div class="h2 px-4 py-1 border-2 border-brand-500 rounded">Q{data.quote.id + 388000}</div>
          <Button
            kind="ghost"
            on:click={async () => {
              open = true;
            }}
          >
            View Quote
          </Button>
        </div>
      </div>
    </div>
    {#if data.quote.status === "Booking"}
      <InlineNotification
        lowContrast
        hideCloseButton
        kind="success"
        title="Processing..."
        subtitle="Please allow us 24 hours or less to process your booking"
        class="mx-auto"
      />
    {:else if data.quote.status === "Request"}
      <InlineNotification
        lowContrast
        hideCloseButton
        kind="success"
        title="SSL Encryption"
        subtitle="This is a secure SSL booking form"
        class="mx-auto"
      />

      <Trip bind:quote={data.quote} />
      <Customer bind:user={data.user} />
      <Driver bind:quote={data.quote} />
      <Passenger bind:quote={data.quote} />
      <Payment bind:quote={data.quote} />
      <div>
        <form method="POST">
          <Button type="submit">Submit</Button>
          <input type="hidden" name="user" value={JSON.stringify(data.user)} />
          <input type="hidden" name="quote" value={JSON.stringify(data.quote)} />
        </form>
      </div>
    {:else}
      <InlineNotification
        lowContrast
        hideCloseButton
        kind="success"
        title="Booking Done!"
        subtitle="Thank you for choosing Australia 4WD Rentals"
        class="mx-auto"
      />
    {/if}
  </div>
  <Modal passiveModal bind:open modalHeading="View Quote" on:open on:close>
    <div id="htmlcontent">
      {#await quotation.create(data.quote.id, "template_quote") then value}
        {@html value}
      {/await}
    </div>
  </Modal>
{/if}
