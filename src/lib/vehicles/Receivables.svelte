<script>
  import { supabase } from "$lib/supabaseClient";
  import { format } from "$lib/format.js";
  import dayjs from "dayjs";
  import { q } from "$lib/quote.js";
  import CryptoJS from "crypto-js";
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Modal,
    NumberInput,
    Select,
    SelectItem,
    TextInput,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  export let quote;

  let open = false;

  let summary = {
    termsItems: [],
  };
  if (!quote.payments) {
    quote.payments = [];
  }
  let newPayment = {
    date: dayjs().format("DD/MM/YYYY"),
    method: "Credit Card",
    amount: 0,
    remark: null,
  };
  let noVal = false;
  let totalPaid = 0;
  const totalPayment = () => {
    let total = 0;
    quote.payments.forEach((item) => {
      total += item.amount;
    });
    totalPaid = total;
  };
  const addPayment = async () => {
    if (newPayment.amount === 0) {
      noVal = true;
    } else {
      quote.payments = [...quote.payments, newPayment];
      //   console.log(quote.payments);

      const { error: updateError } = await supabase
        .from("quotes")
        .update({ payments: quote.payments })
        .eq("id", quote.id);

      if (updateError) {
        console.log(updateError);
      }

      newPayment = {
        date: dayjs().format("DD/MM/YYYY"),
        method: "Credit Card",
        amount: 0,
        remark: null,
      };
      noVal = false;
      summary = q.getPayments(quote);
      totalPayment();
    }
  };
  const delPayment = async (index) => {
    let newQuote = quote.payments;
    newQuote.splice(index, 1);
    quote.payments = [...newQuote];
    const { error: updateError } = await supabase
      .from("quotes")
      .update({ payments: quote.payments })
      .eq("id", quote.id);
    if (updateError) {
      console.log(updateError);
    }

    summary = q.getPayments(quote);
    totalPayment();
  };

  let passcode = "";

  onMount(() => {
    summary = q.getPayments(quote);
    totalPayment();
  });
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Payment Schedule</h2>
  </div>
  <div class="px-4 mb-8">
    {#each summary.termsItems as item}
      <div class="flex py-3 border-b border-gray-200">
        <div class="flex-1">{@html item.name}</div>
        <div class="w-20 text-right">${format.currency(item.total)}</div>
      </div>
    {/each}
    <div class="bg-brand-100 p-4 border border-brand-500">
      <h3 class="h3">Payment Summary</h3>
      <div class="py-3 flex border-b border-gray-300">
        <div class="flex-1">Total payable to agent</div>
        <div class="w-20 text-right">${format.currency(summary.totalAgent)}</div>
      </div>
      <div class="py-3 flex border-b border-gray-300">
        <div class="flex-1">Total amount paid</div>
        <div class="w-20 text-right">${format.currency(totalPaid)}</div>
      </div>
      <div class="pt-3 flex font-bold">
        <div class="flex-1">Balance</div>
        <div class="w-20 text-right">${format.currency(summary.totalAgent - totalPaid)}</div>
      </div>
    </div>
  </div>
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Payments</h2>
  </div>
  <div class="p-4">
    {#each quote.payments as item, index}
      <div class="py-1 border-b border-gray-200">
        <div class="flex">
          <div class="w-28 py-1">{item.date}</div>
          <div class="flex-1 py-1">
            <div>{item.method}</div>
            <div class="text-gray-400">{@html item.remark || "&nbsp;"}</div>
          </div>
          <div class="text-right w-24 py-1">${format.currency(item.amount)}</div>
          <div>
            <Button
              kind="danger-ghost"
              size="small"
              class="p-0.5 h-6"
              on:click={() => {
                delPayment(index);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"
                ><path
                  d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 4V6H15V4H9Z"
                /></svg
              >
            </Button>
          </div>
        </div>
      </div>
    {:else}
      <div class="p-3 mb-3 border border-dashed border-gray-200 text-gray-400 text-center">No Payment</div>
    {/each}
    <div class="p-4 bg-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <DatePicker datePickerType="single" dateFormat="d/m/Y" bind:value={newPayment.date} required>
          <DatePickerInput labelText="Date" placeholder="dd/mm/yyyy" />
        </DatePicker>
        <Select labelText="Method" bind:selected={newPayment.method}>
          <SelectItem value="Credit Card" text="Credit Card" />
          <SelectItem value="Bank Transfer" text="Bank Transfer" />
          <SelectItem value="Cash" text="Cash" />
        </Select>
        <NumberInput
          label="Amount"
          bind:value={newPayment.amount}
          step={0.01}
          required
          helperText={noVal ? "No amount" : ""}
        />
      </div>
      <div class="flex">
        <div class="flex-1">
        <TextInput labelText="Remark" class="md:col-span-2" bind:value={newPayment.remark} />
        </div>
        <div class="pt-6 ml-4">
            <Button on:click={addPayment}>Add</Button>
        </div>
      </div>
    </div>
  </div>
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Credit Card Details</h2>
  </div>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div class="label">Card type</div>
        <div class="value">{quote.cc_type || "—"}</div>
      </div>
      <div>
        <div class="label">Card name</div>
        <div class="value">{quote.cc_name || "—"}</div>
      </div>
      <div class="md:col-span-2">
        <div class="label">Card number</div>
        <div class="value">{quote.cc_number || "—"}</div>
      </div>
      <div>
        <div class="label">Card CVV</div>
        <div class="value truncate">{quote.cc_cvv || "—"}</div>
      </div>
      <div>
        <div class="label">Card date</div>
        <div class="value">{quote.cc_month || "—"}/{quote.cc_year || "—"}</div>
      </div>
      <div>
        <div class="label">Card comment</div>
        <div class="value">{quote.cc_remark || "—"}</div>
      </div>
    </div>
    <div class="p-4 bg-gray-100 md:flex justify-between mt-4">
      <div class="flex">
        <TextInput bind:value={passcode} placeholder="Passcode" />
        <Button
          on:click={() => {
            quote.cc_number = CryptoJS.AES.decrypt(quote.cc_number, passcode).toString(CryptoJS.enc.Utf8);
            quote.cc_cvv = CryptoJS.AES.decrypt(quote.cc_cvv, passcode).toString(CryptoJS.enc.Utf8);
          }}>Reveal Card</Button
        >
      </div>
      <div class="mt-2 md:mt-0">
        <Button
          kind="danger-tertiary"
          on:click={() => {
            open = true;
          }}
        >
          Clear Card
        </Button>
      </div>
    </div>
  </div>
</div>
<Modal
  passiveModal
  bind:open
  modalHeading="Clear credit card detail"
  size="sm"
>
  <p class="mb-8">This is a permanent action and cannot be undone.</p>
  <form action="?/clearcard" method="POST">
    <div class="flex justify-center">
      <Button type="submit" kind="danger">Clear</Button>
      <Button kind="danger-tertiary" class="ml-1" on:click={() => (open = false)}>Cancel</Button>
    </div>
  </form>
</Modal>
