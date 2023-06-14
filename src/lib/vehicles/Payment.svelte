<script>
  import { Button, Modal, Select, SelectItem, TextArea, TextInput, InlineNotification } from "carbon-components-svelte";
  import { format } from "$lib/format.js";
  import { q } from "$lib/quote.js";
  import { onMount } from "svelte";
  export let title = "Payment Information";
  export let description = null;
  export let quote;
  const thisYear = new Date().getFullYear();
  const pad = (num) => {
    var s = "0" + num;
    return s.slice(-2);
  };
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
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">{title}</h2>
    {#if description}
      <div class="text-gray-500">
        {description}
      </div>
    {/if}
    <!-- <InlineNotification
      lowContrast
      hideCloseButton
      kind="warning"
      title="Important"
      subtitle="Suppliers / operators may require a deposit or full payment - please refer to your quote for details; Please note your credit card statement will show billing as Australia 4 Wheel Drive Rentals."
      class="mx-auto"
    /> -->
  </div>
  <div class="p-4 grid grid-cols-1 gap-5">
    <div class="grid grid-cols-1 gap-5">
      <div>
        <Select labelText="Amount to Pay" name="deposit" bind:selected={quote.deposit} required>
          {#each summary.termsItems as item}
            <SelectItem value={item.total} text={`${item.name} (AUD $${format.currency(item.total)})`} />
          {/each}
        </Select>
      </div>
      <div>
        <Select labelText="Card Type" name="cc_type" bind:selected={quote.cc_type} required>
          <SelectItem value="" text="Select a card type" />
          <SelectItem value="MasterCard" text="MasterCard" />
          <SelectItem value="Visa" text="Visa" />
        </Select>
      </div>
      <div>
        <TextInput labelText="Name on Card" name="cc_name" bind:value={quote.cc_name} required />
      </div>
      <div>
        <TextInput labelText="Credit Card No." name="cc_number" bind:value={quote.cc_number} required />
      </div>
      <div>
        <div class="font-bold text-sm tracking-wide">Card Expiry</div>
        <div class="grid grid-cols-2">
          <Select labelText="" helperText="Month" name="cc_month" bind:selected={quote.cc_month} required>
            <SelectItem value="" text="Select a month" />
            {#each Array(12) as _, mo}
              <SelectItem value={mo + 1} text={pad(mo + 1)} />
            {/each}
          </Select>
          <Select labelText="" helperText="Year" name="cc_year" bind:selected={quote.cc_year} required>
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
          bind:value={quote.cc_cvv}
          required
        />
      </div>
      <div>
        <TextArea
          labelText="Comments"
          helperText="Please enter any additional information you wish us to know about."
          name="cc_remark"
          bind:value={quote.cc_remark}
        />
      </div>
    </div>
  </div>
</div>
