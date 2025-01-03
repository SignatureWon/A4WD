<script>
  import {
    Button,
    Checkbox,
    InlineNotification,
    Modal,
    Select,
    SelectItem,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";
  // import { html as quotation } from "$lib/html.js";
  // let open = false;

  import Trip from "$lib/vehicles/Trip.svelte";
  import Customer from "$lib/vehicles/Customer.svelte";
  import Driver from "$lib/vehicles/Driver.svelte";
  import Passenger from "$lib/vehicles/Passenger.svelte";
  import Payment from "$lib/vehicles/Payment.svelte";
  import Step1 from "./Step1.svelte";

  export let data;
  // console.log(data);
</script>

{#if !data.quote}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No booking detail</div>
      <Button href="/">Back to home</Button>
    </div>
  </div>
{:else}
  <div class="mx-auto max-w-5xl p-4">
    <h1 class="h1 mb-4">Vehicle Booking Request</h1>
    <div class="p-4 bg-green-100 flex items-center border border-green-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        class="w-4 h-4 mr-2 text-green-800"
        fill="currentColor"
        ><path
          d="M19 10H20C20.5523 10 21 10.4477 21 11V21C21 21.5523 20.5523 22 20 22H4C3.44772 22 3 21.5523 3 21V11C3 10.4477 3.44772 10 4 10H5V9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9V10ZM17 10V9C17 6.23858 14.7614 4 12 4C9.23858 4 7 6.23858 7 9V10H17ZM11 14V18H13V14H11Z"
        /></svg
      >
      <strong>SSL Encryption</strong>: This is a secure SSL booking form
    </div>
    <Step1 bind:quote={data.quote} />

    {#if data.quote.status === "Booking"}
      <div class="mx-auto max-w-5xl px-4 py-10">
        <h2 class="h2">Processing</h2>
        Please allow us 24 hours or less to process your booking
      </div>
    {:else if data.quote.status === "Request"}
      <form method="POST">
        <Customer
          bind:quote={data.quote}
          bind:user={data.user}
          title="Step 2: Update Contact Details & Travel Plans"
          description="Please update your contact details if required and tell us more about your travel plans (e.g. flight number and arrival date and time if arriving by air). This will help us to serve you better."
        />
        <!-- <Driver bind:quote={data.quote} />
      <Passenger bind:quote={data.quote} /> -->
        <Payment
          bind:quote={data.quote}
          title="Step 3: Enter Billing Information"
          description="Please update your contact details if required. This will help us to serve you better."
        />
        <div class="bg-white rounded mb-4">
          <div class="p-5 border-b border-gray-200">
            <h2 class="h2 mb-5">Step 4: Review Terms & Conditions of Booking</h2>
            <p class="mb-5">
              By clicking the <strong>Book Now</strong> button you acknowledge that you have read, understood and agreed
              to the cancellation policy, terms and agreement of Australia 4WD Rentals and their suppliers
            </p>
            <ul class="list-decimal pl-4">
              <li>Your credit card will not be billed until we have confirmed availability of your desired vehicle.</li>
              <li>
                The credit card you see must be the same credit card you will present to the supplier when picking-up
                your vehicle.
              </li>
              <li>By completing and submitting this form I hereby acknowledge that I agree to a booking.</li>
              <li>I agree to abide by the terms and conditions of this booking.</li>
              <li>
                I agree to a deposit or full payment, as quoted, being taken from the credit card specified above.
              </li>
              <li>
                Click <a href="https://www.australia4wdrentals.com/conditions-australia-4-wheel-drive-rentals">here</a> to
                view our terms and agreements.
              </li>
            </ul>
          </div>
        </div>
        <div class="bg-brand-100 rounded mb-4 p-5 border border-brand-500">
          <div class="mb-4">
            <Checkbox
              name="user_agree"
              bind:checked={data.quote.user_agree}
              labelText="I fully understand and accept the terms, conditions of the supplier of the rental vehicle and booking agent by Australia 4 Wheel Drive Rentals and the payment."
              required
            />
          </div>

          <div>
            <Button type="submit">Submit booking request now</Button>
            <input type="hidden" name="user" value={JSON.stringify(data.user)} />
            <input type="hidden" name="quote" value={JSON.stringify(data.quote)} />
          </div>
        </div>
      </form>
    {:else}
      <div class="mx-auto max-w-5xl px-4 py-10">
        <h2 class="h2">Booking Done!</h2>
        Thank you for choosing Australia 4WD Rentals
      </div>
    {/if}
  </div>
  <!-- <Modal passiveModal bind:open modalHeading="View Quote" on:open on:close>
    <div id="htmlcontent">
      {#await quotation.create(data.quote.id, "template_quote") then value}
        {@html value}
      {/await}
    </div>
  </Modal> -->
{/if}
