<script>
  import { Button, Checkbox, Modal, TextInput } from "carbon-components-svelte";

  /** @type {import('./$types').PageData} */
  export let data;

  let open = false;
</script>

<h2 class="text-2xl mb-2">Trip Details</h2>
<section class="bg-white p-2 mb-8">
  <!-- <h2 class="uppercase tracking-wider font-bold mb-2">Trip Summary</h2> -->
  <div class="grid grid-cols-1 md:grid-cols-3">
    <div
      class="bg-cover bg-center bg-no-repeat"
      style="background-image: url('https://rixauffklvvhkfkwrpme.supabase.co/storage/v1/object/public/gallery/thumb-vehicles-2b25d7e9-74df-4986-b578-78535c9034e5.jpg');"
    />
    <div class="px-4 col-span-2">
      <h2 class="text-lg font-bold mb-4">Apollo Adventure Camper</h2>
      <div class="flex items-center justify-between py-2">
        <div class="w-5/12">
          <div
            class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400"
          >
            Pickup
          </div>
          <div>Adelaide</div>
          <div>12 May 2023 (Fri)</div>
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
            Dropoff
          </div>
          <div>Adelaide</div>
          <div>24 May 2023 (Wed)</div>
        </div>
      </div>
    </div>
  </div>
</section>

<h2 class="text-2xl mb-2">Price Details</h2>
<section class="bg-white p-4 mb-0.5">
  <div
    class="uppercase tracking-wider font-bold mb-3 text-xs text-gray-400 flex justify-between py-2"
  >
    <div>Basic</div>
    <div>AUD $</div>
  </div>
  <div class="divide-y divide-gray-200">
    <div class="flex justify-between py-2">
      <div>Daily Rate @ AUD$335 x 14 days</div>
      <div>$4,690</div>
    </div>
    <div class="flex justify-between py-2">
      <div>Public Holiday Surcharge</div>
      <div>$200</div>
    </div>
  </div>
</section>

<section class="bg-white p-4 mb-0.5">
  <div
    class="uppercase tracking-wider font-bold text-xs text-gray-400 flex justify-between py-2"
  >
    Accident Liability
  </div>
  <div class="mb-3">Select your level of liability from the options below. <a href="#">See Terms here</a></div>
  <div class="grid grid-cols-3 gap-4">
    <div class="border border-gray-200 p-3 flex flex-col">
      <div class="flex-1 pb-8">
        <h4 class="font-bold text-brand-600">Standard</h4>
        <div class="text-xl font-bold">AUD $0</div>
        <div class="mb-4">$0 x 14 days</div>
        <div class="mb-4 font-bold">$5,000 Excess<br />$5,000 Bond</div>
        <div class="mb-4 text-gray-500">
          Your damage liability is $5,000 with a $5,000 security bond payable at
          pickup.
        </div>
      </div>
      <div class="text-center py-2 text-brand-600">Select</div>
    </div>
    <div class="border border-brand-600 bg-brand-50 p-3 flex flex-col">
      <div class="flex-1 pb-8">
        <h4 class="font-bold text-brand-600">Liability Reduction</h4>
        <div class="text-xl font-bold">AUD $420</div>
        <div class="mb-4">$30 x 14 days</div>
        <div class="mb-4 font-bold">$0 Excess<br />$0 Bond</div>
        <div class="font-bold">Inclusions</div>
        <ul class="list-disc pl-4">
          <li>Pre-purchased Gas Bottle</li>
          <li>Camp Chairs and Table</li>
          <li>Baby/Booster Seats (with prior request)</li>
        </ul>
      </div>
      <div class="text-center py-2 bg-brand-600 text-white font-bold">
        Selected
      </div>
    </div>
    <div class="border border-gray-200 p-3 flex flex-col">
      <div class="flex-1 pb-8">
        <h4 class="font-bold text-brand-600">Inclusive</h4>
        <div class="text-xl font-bold">AUD $700</div>
        <div class="mb-4">$50 x 14 days</div>
        <div class="mb-4 font-bold">$0 Excess<br />$0 Bond</div>
        <div class="font-bold">Inclusions</div>
        <ul class="list-disc pl-4">
          <li>Pre-purchased Gas Bottle</li>
          <li>Camp Chairs and Table</li>
          <li>Baby/Booster Seats (with prior request)</li>
        </ul>
      </div>
      <div class="text-center py-2 text-brand-600">Select</div>
    </div>
  </div>
</section>
<section class="bg-white p-4 mb-0.5">
  <div
    class="uppercase tracking-wider font-bold mb-3 text-xs text-gray-400 flex justify-between py-2"
  >
    <div>Add-ons</div>
    <div>AUD $</div>
  </div>
  <div class="divide-y divide-gray-200">
    <div class="flex justify-between py-2">
      <div><Checkbox labelText="Navigation System" /></div>
      <div>200</div>
    </div>
    <div class="flex justify-between py-2">
      <div><Checkbox labelText="2 Chairs + 1 Table Bundle" /></div>
      <div>200</div>
    </div>
    <div class="flex justify-between py-2">
      <div><Checkbox labelText="Child Safety Seat" /></div>
      <div>200</div>
    </div>
    <div class="flex justify-between py-2">
      <div><Checkbox labelText="Tyre and Windscreen Cover" /></div>
      <div>200</div>
    </div>
    <div class="flex justify-between py-2">
      <div><Checkbox labelText="LPG Fee" /></div>
      <div>200</div>
    </div>
  </div>
</section>
<section class="bg-white p-4 mb-0.5">
  <div class="text-xl font-bold text-center">Total $2,345.00</div>
  <div class="grid grid-cols-2">
    <Button
      size="small"
      kind="tertiary"
      on:click={(e) => {
        open = true;
      }}>Email Quote</Button
    >
    <Button size="small" href="/search/details">Book Now</Button>
  </div>
</section>

<Modal
  bind:open
  modalHeading="Send quote to my email"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => (open = false)}
  on:open
  on:close
  on:submit
>
  <div class="max-w-md mx-auto mt-10">
    <TextInput labelText="Name" class="mb-5" />
    <TextInput labelText="Email" class="mb-5" />
    <TextInput labelText="Phone" class="mb-5" />
  </div>
</Modal>
