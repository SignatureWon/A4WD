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
  console.log("data", data);
  console.log("form", form);
</script>

{#if !form}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No confirmation detail</div>
      <Button href="/search">Back to search</Button>
    </div>
  </div>
{:else}
  <div class="p-4 bg-white">
    <div class="mx-auto max-w-3xl p-4">
      <h1 class="text-3xl font-bold mb-4">Thank you!</h1>
      <div class="mb-8 text-lg text-gray-600">{data.content.description}</div>
      <div class="p-5 bg-brand-100 text-xl">
        <div>
          Reference Number:
        </div>
        <div class="text-3xl font-bold">
          {form.quote.id + 388000}
        </div>
        <div class="text-base mt-5 pt-5 border-t border-gray-300">
          Please check your email, or <a href="/booking" class="text-brand-600">click here</a> to check
          your booking status
        </div>
      </div>
    </div>
  </div>
{/if}
