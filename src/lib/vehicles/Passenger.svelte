<script>
  import { NumberInput } from "carbon-components-svelte";
  export let quote;
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Passenger Information</h2>
  </div>
  <div class="p-4 grid grid-cols-1 gap-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <NumberInput name="adult" label="Adult" bind:value={quote.details.passenger.adult} allowEmpty required />
      </div>
      <div>
        <NumberInput
          name="children"
          label="Children"
          bind:value={quote.details.passenger.children}
          allowEmpty
          required
        />
      </div>
    </div>
  </div>
</div>
