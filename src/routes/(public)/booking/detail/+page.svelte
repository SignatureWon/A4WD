<script>
  import { Button, Modal, Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";
  import { html as quotation } from "$lib/html.js";
  import { html as provisional } from "$lib/provisional.js";

  export let data;
  export let form;
  // console.log("FORM", form);
  let initial = "";
  let status = "";
  let message = "";
  let button = "";
  let preview = "";

  if (!form) {
    console.log("no form");
    form = {
      quote: {
        status: null
      }
    }
  }

  if (form.quote.status === "Request") {
    initial = "Q";
    status = "New Quote";
    message =
      "If you have just entered a self quote request, please allow us 24 hours or less to check availability and price. Quotes are valid for 7 days or till Sunday night 6pm.";
    button = "View Quote";
  } else if (form.quote.status === "Provisional") {
    initial = "P";
    status = "Vehicle Available";
    message = "Vehicle available, please book now using our secure online booking form below";
    button = "View Provisional Ticket";
  } else if (form.quote.status === "Booking") {
    initial = "T";
    status = "Processing Payment";
    message = "We have received your online booking form, please allow us 24 hours or less to process the payments";
    button = "View Ticket";
  } else if (form.quote.status === "Deposit") {
    initial = "T";
    status = "Deposit Paid";
    message = "We have received your deposit. A final ticket will be issued once full payment has been made.";
    button = "View Ticket";
  } else if (form.quote.status === "Payment_1") {
    initial = "T";
    status = "First Payment Paid";
    message = "We have received your first payment. A final ticket will be issued once full payment has been made.";
    button = "View Ticket";
  } else if (form.quote.status === "Payment_2") {
    initial = "T";
    status = "Second Payment Paid";
    message = "We have received your first payment. A final ticket will be issued once full payment has been made.";
    button = "View Ticket";
  } else if (form.quote.status === "Confirmed") {
    initial = "T";
    status = "Full Payment Paid";
    message = "We have received your full payment. Thank you and enjoy your trip";
    button = "View Final Ticket";
  }

  let open = false;

  const thisYear = new Date().getFullYear();
  const pad = (num) => {
    var s = "0" + num;
    return s.slice(-2);
  };
</script>

{#if !form.quote.status}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No booking detail</div>
      <Button href="/booking">Check your booking</Button>
    </div>
  </div>
{:else}
  <div class="p-4 bg-white pb-60">
    <div class="mx-auto max-w-3xl p-4">
      <div class="text-xl">
        <div class="grid grid-cols-2 gap-4 pb-8 mb-8 border-b border-gray-200">
          <div>
            <div>Reference Number:</div>
            <div class="text-3xl font-bold">
              {initial}{form.quote.id + 388000}
            </div>
          </div>
          <div class="text-right">
            <div>Status:</div>
            <div class="text-3xl font-bold">{status}</div>
          </div>
        </div>
      </div>
      <div class="mb-4 text-lg text-gray-600">{message}</div>
      <div class="mb-8">
        <Button
          kind="tertiary"
          on:click={async () => {
            if (form.quote.status === "Request") {
              preview = await quotation.create(form.quote.id, "template_quote");
            } else if (form.quote.status === "Provisional") {
              preview = await provisional.create(form.quote.id);
            }
            open = true;
          }}>{button}</Button
        >
      </div>
      {#if form.quote.status === "Provisional"}
        <div class="bg-gray-50 p-5">
          <div class="pb-4 mb-4 border-b border-gray-300">
            <h2 class="font-bold text-xl">Book now</h2>
            <div>This is a secure SSL booking form</div>
          </div>
          <h3 class="font-bold mb-2 text-lg">Payment Information</h3>
          <div class="text-gray-600 p-4 bg-gray-200 mb-4">
            <div class="font-bold">IMPORTANT:</div>
            <ul class="list-disc pl-4">
              <li>
                Suppliers / operators may require a deposit or full payment - please refer to your quote for details.
              </li>
              <li>Please note your credit card statement will show billing as Australia 4 Wheel Drive Rentals.</li>
            </ul>
          </div>
          <form action="/booking/process" method="post">
            <div class="grid grid-cols-1 gap-6">
              <div>
                <Select labelText="Card Type" name="cc_type" required>
                  <SelectItem value="" text="Select a card type" />
                  <SelectItem value="MasterCard" text="MasterCard" />
                  <SelectItem value="Visa" text="Visa" />
                </Select>
              </div>
              <div>
                <TextInput labelText="Name on Card" name="cc_name" required />
              </div>
              <div>
                <TextInput labelText="Credit Card No." name="cc_number" required />
              </div>
              <div>
                <div class="font-bold text-sm tracking-wide">Card Expiry</div>
                <div class="grid grid-cols-2">
                  <Select labelText="" helperText="Month" name="cc_month" required>
                    <SelectItem value="" text="Select a month" />
                    {#each Array(12) as _, mo}
                      <SelectItem value={mo + 1} text={pad(mo + 1)} />
                    {/each}
                  </Select>
                  <Select labelText="" helperText="Year" name="cc_year" required>
                    <SelectItem value="" text="Select a year" />
                    {#each Array(20) as _, yr}
                      <SelectItem value={thisYear + yr} text={thisYear + yr} />
                    {/each}
                  </Select>
                </div>
              </div>
              <div>
                <TextInput
                  labelText="Security Code (CVV)"
                  helperText="Last 3 numbers on back of credit card - VISA and MasterCard only."
                  name="cc_cvv"
                  required
                />
              </div>
              <div>
                <TextArea
                  labelText="Comments"
                  helperText="Please enter any additional information you wish us to know about."
                  name="cc_remark"
                />
              </div>
              <div>
                <Button type="submit">Submit</Button>
              </div>
            </div>
            <input type="hidden" name="id" value={form.quote.id} />
            <input type="hidden" name="users" value={form.quote.users.id} />
          </form>
        </div>
      {/if}
    </div>
  </div>
  <Modal passiveModal bind:open modalHeading={button} on:open on:close>
    <div id="htmlcontent">
      {@html preview}
    </div>
  </Modal>

  <!-- {#if form.quote.status === "Request"}
          New Quote
        {:else if form.quote.status === "Provisional"}
          Vehicle Available
        {:else if form.quote.status === "Booking"}
          Processing Payment
        {:else if form.quote.status === "Deposit"}
          Deposit Paid
        {:else if form.quote.status === "Payment_1"}
          First Payment Paid
        {:else if form.quote.status === "Payment_2"}
          Second Payment Paid
        {:else if form.quote.status === "Confirmed"}
          Full Payment Paid
        {/if} -->
{/if}
