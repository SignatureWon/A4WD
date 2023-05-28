<script>
    import {
      Button,
      Select,
      SelectItem,
      TextArea,
      TextInput,
    } from "carbon-components-svelte";
  
    export let data;
    export let form;
  </script>
  
  {#if !form}
    <div class="p-4">
      <div class="px-4 py-20 text-center bg-white">
        <div class="mb-5">No confirmation detail</div>
        <Button href="/admin/sales/calculator">Back to calculator</Button>
      </div>
    </div>
  {:else}
    <div class="p-4 bg-white">
      <div class="mx-auto max-w-3xl p-4">
        <h1 class="text-3xl font-bold mb-4">Done!</h1>
        <div class="p-5 bg-brand-100 text-xl">
          <div>
            Reference Number:
          </div>
          <div class="text-3xl font-bold">
            {form.quote.id + 388000}
          </div>
          <div class="text-base mt-5 pt-5 border-t border-gray-300 text-center">
            <Button href="/admin/sales/booking" class="px-10">Manage Booking</Button>
          </div>
        </div>
      </div>
    </div>
  {/if}
  