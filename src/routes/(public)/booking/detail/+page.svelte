<script>
  import { Button } from "carbon-components-svelte";

  export let data;
  export let form;
  //   console.log("FORM", form);
</script>

{#if !form}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No booking detail</div>
      <Button href="/booking">Check your booking</Button>
    </div>
  </div>
{:else if form.quote}
  <div class="p-4 bg-white">
    <div class="mx-auto max-w-3xl p-4">
      <h1 class="text-3xl font-bold mb-4">Booking found</h1>
      <div class="mb-8 text-lg text-gray-600">{data.content.description}</div>
      <div class="p-5 bg-brand-100 text-xl">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <div>Reference Number:</div>
            <div class="text-3xl font-bold">
              {form.quote.id + 388000}
            </div>
          </div>
          <div class="text-right">
            <div>Status:</div>
            <div class="text-3xl font-bold">
              {form.quote.status}
            </div>
          </div>
        </div>
        {#if form.quote.status === "Request"}
          <div class="text-base mt-5 pt-5 border-t border-gray-300 text-xl">
            <a
              href="https://rixauffklvvhkfkwrpme.supabase.co/storage/v1/object/public/quotes/Q{form
                .quote.id + 388000}.pdf"
              class="text-brand-600" target="_blank">View your quote</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">Booking not found</div>
      <Button href="/booking">Check again</Button>
    </div>
  </div>
{/if}
