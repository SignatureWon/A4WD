<script>
  import { supabase } from "$lib/supabaseClient";
  import { Button, Modal, Select, SelectItem, TextArea, TextInput, InlineNotification } from "carbon-components-svelte";
  import { format } from "$lib/format.js";
  import { q } from "$lib/quote.js";
  import { onMount } from "svelte";
  export let title = "Payment Information";
  export let description = null;
  export let quote;
  export let user;

  // console.log("quote", quote);

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

  const selectedConstants = ["bank_name", "bank_account", "bank_abn", "bank_bsb", "bank_number", "bank_swift"];
  let bank = {};

  onMount(async () => {
    summary = q.getPayments(quote);

    if (quote.bank_only) {
      const { data, error } = await supabase.from("constants").select("name, type").in("type", selectedConstants);

      if (data) {
        data.forEach((item) => {
          bank[item.type] = item.name;
        });
      }
    }
  });
  $: {
    summary = q.getPayments(quote);
  }
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
      <div class="divide-y divide-gray-200 border border-gray-200 px-2 bg-gray-100">
        {#each summary.termsItems as item}
          <div class="py-2">
            <div class="flex">
              <div class="flex-1">{item.name}</div>
              <div class="text-right w-28">
                ${format.currency(item.total)}
              </div>
            </div>
          </div>
        {/each}
        <!-- <Select labelText="Amount to Pay" name="deposit" bind:selected={quote.deposit} required>
          {#each summary.termsItems as item}
            <SelectItem value={item.total} text={`${item.name} (AUD $${format.currency(item.total)})`} />
          {/each}
        </Select> -->
      </div>
      {#if quote.bank_only}
        <div class="bg-brand-100 rounded mb-4 px-5 border border-brand-500">
          <div class="text-xs font-bold tracking-wider text-brand-500 mt-4">BANK DETAILS</div>
          <div class="divide-y divide-brand-300">
            <div class="flex flex-col py-2">
              <div>Bank Name</div>
              <div class="font-bold">{bank.bank_name}</div>
            </div>
            <div class="flex flex-col py-2">
              <div>Account Name</div>
              <div class="font-bold">{bank.bank_account}</div>
            </div>
            <div class="flex flex-col py-2">
              <div>Account Number</div>
              <div class="font-bold">{bank.bank_number}</div>
            </div>
            <div class="flex flex-col py-2">
              <div>ABN Number</div>
              <div class="font-bold">{bank.bank_abn}</div>
            </div>
            <div class="flex flex-col py-2">
              <div>BSB Number</div>
              <div class="font-bold">{bank.bank_bsb}</div>
            </div>
            <div class="flex flex-col py-2">
              <div>Swift Code</div>
              <div class="font-bold">{bank.bank_swift}</div>
            </div>
            <div class="flex flex-col py-2">
              <div>Reference</div>
              <div class="font-bold">{user.last_name}{user.first_name}Q{quote.id + 388000}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="text-xs font-bold tracking-wider text-brand-500 mb-4">NOTES</div>
          <div class="px-4 border-l border-brand-500">
            <p class="mb-4">
              The reference must be your <b>Surname</b> then <b>First Name</b> then <b>Quote Number</b> (no spaces, no dashes,
              no characters)
            </p>
            <p class="mb-4">
              When you enter account number from overseas please enter the BSB 6 digits first followed by our bank
              account number next which is 9 digits so account number is 15 digit no spaces or dash as International
              Swift require 11 digits. Example: <b>105185018913140</b>
            </p>
            <p class="mb-4">
              Please take a screenshot before and after successful payment and email it to us at
              <a href="mailto:info@australia4wdrentals.com.au" class="text-brand-500 font-bold"
                >info@australia4wdrentals.com.au</a
              >
            </p>
          </div>
        </div>
      {:else}
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
          <TextInput
            labelText="Credit Card No."
            name="cc_number"
            bind:value={quote.cc_number}
            title="MasterCard and Visa number"
            pattern={`^[0-9]{16}$`}
            required
          />
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
            pattern={`^[0-9]{3,4}$`}
            title="Last 3 numbers on back of credit card - VISA and MasterCard only."
            required
          />
        </div>
      {/if}
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
