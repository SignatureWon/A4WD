<script>
  import { format } from "$lib/format.js";
  import { Button, Modal, NumberInput, Select, SelectItem, TextInput } from "carbon-components-svelte";
  export let quote;
  export let options;
  let modalSendQuote = false;

  const createQuote = async () => {
    // let valid = true
    // console.log("quote", quote);
    error_message = [];
    if (!quote.users.id) {
      error_message.push("No selected user");
    }
    if (!quote.details.driver.license.length) {
      error_message.push("No driver license");
    }
    if (!quote.details.driver.age || quote.details.driver.age === 0) {
      error_message.push("No driver age");
    }
    if (!quote.details.passenger.adult === 0) {
      error_message.push("No adult passenger");
    }
    if (error_message.length === 0) {
      let newQuote = { ...quote };
      newQuote.users = quote.users.id;
      delete newQuote.id;

      const { data, error } = await supabase.from("quotes").insert(newQuote).select().single();
      setTimeout(() => {
        goto(`/admin/sales/quotes/${data.id}`);
      }, 500);
    }
  };
</script>

<div
  class="bg-white fixed bottom-0 left-0 w-full p-4 border-t border-gray-200 z-50"
  style="box-shadow: 0 0 20px rgba(0,0,0,.2);"
>
  <div class="flex items-center">
    <div class="flex-1 font-bold text-lg">
      Total: ${format.currency(quote.agent_fee + quote.supplier_fee)}
    </div>
    <div>
      <Button on:click={() => {
        modalSendQuote = true;
        console.log(quote.details);
      }}>Get Instant Quote</Button>
    </div>
  </div>
</div>
<Modal
  bind:open={modalSendQuote}
  modalHeading="Travel Information"
  passiveModal
  on:click:button--secondary={() => (modalSendQuote = false)}
>
  <div class="max-w-md mx-auto mt-10 mb-5">
    <form method="POST">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="col-span-2">
          <TextInput labelText="Email" type="email" name="email" value={quote.users.email} required />
        </div>
        <div>
          <Select name="license" labelText="Driver's License" value={quote.details.driver.license}>
            {#each options[3].options as license}
              <SelectItem value={license.name} />
            {/each}
          </Select>
        </div>
        <div>
          <NumberInput name="age" label="Driver's Age" value={quote.details.driver.age} allowEmpty required />
        </div>
        <div>
          <NumberInput name="adult" label="No. of Adult" value={quote.details.passenger.adult} allowEmpty required />
        </div>
        <div>
          <NumberInput name="children" label="No. of Children" value={quote.details.passenger.children} allowEmpty required />
        </div>
        <div class="col-span-2">
          <Button type="submit" class="w-full">Next</Button>
          <Button kind="ghost" type="button" class="w-full" on:click={() => (modalSendQuote = false)}>Cancel</Button>
        </div>
      </div>
      <input type="hidden" name="detail" value={JSON.stringify(quote)} />
      <!-- <input type="hidden" name="detail" value={encodeURIComponent(JSON.stringify(quote.details))} /> -->
    </form>
  </div>
</Modal>
