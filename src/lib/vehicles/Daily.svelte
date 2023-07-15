<script>
  import { format } from "$lib/format.js";
  import { q } from "$lib/quote.js";
  import { Button, NumberInput, TextInput } from "carbon-components-svelte";
  // import { calculator } from "$lib/calculator.js";

  import { onMount } from "svelte";
  export let quote;
  export let count;

  // console.log(quote);

  let list = [];
  let editRow = [];
  let oriRow = [];

  if (!quote.add_discount) {
    quote.add_discount = 0;
  }
  if (!quote.add_discount_supplier) {
    quote.add_discount_supplier = quote.add_discount;
  }
  const getDailyTotal = () => {
    quote.details.daily.gross = 0;
    quote.details.daily.nett = 0;
    quote.details.daily.profit = 0;

    quote.details.daily.items.forEach((item) => {
      quote.details.daily.gross += item.gross;
      quote.details.daily.nett += item.nett;
      quote.details.daily.profit += item.profit;
    });

    // must be a negative value for deduction
    if (quote.add_discount > 0) {
      quote.add_discount = 0;
    }

    quote.details.daily.gross += quote.add_discount_supplier;
    quote.details.daily.nett += quote.add_discount_supplier;
    quote.details.daily.profit += quote.add_discount;

    count();
  };

  onMount(() => {
    list = q.getDailyRates(quote);
    getDailyTotal();
  });
  // let grr
  $: {
    //   grr = calculator.group_rates(quote);
    // console.log(grr);

    list = q.getDailyRates(quote);
    getDailyTotal();
  }
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Daily Basic Rental</h2>
  </div>
  <div class="px-4 divide-y divide-gray-200">
    {#each list as item, index}
      {#if editRow[index]}
        <div class="flex">
          {#if item.flex}
            <TextInput class="flex-1 mx-1" bind:value={item.flex} labelText="Flex" />
          {/if}
          <NumberInput
            class="flex-1 mx-1"
            bind:value={item.daily.gross}
            label="Gross"
            step={0.01}
            on:change={() => {
              item.total = item.daily.gross * item.days;
              item.daily.profit = item.daily.gross - item.daily.nett;
              item.profit = item.daily.profit * item.days;
            }}
          />
          <NumberInput
            class="flex-1 mx-1"
            bind:value={item.daily.nett}
            label="Nett"
            step={0.01}
            on:change={() => {
              item.nett = item.daily.nett * item.days;
              item.daily.profit = item.daily.gross - item.daily.nett;
              item.profit = item.daily.profit * item.days;
            }}
          />
        </div>
        <div class="flex m-1">
          <Button
            class="text-sm py-0.5 h-6"
            on:click={() => {
              let daily = quote.details.daily;
              let start = (item.week - 1) * 7;
              for (let i = start; i < start + item.days; i++) {
                daily.items[i].flex = item.flex;
                daily.items[i].gross = item.daily.gross;
                daily.items[i].nett = item.daily.nett;
                daily.items[i].profit = item.daily.profit;
              }
              console.log("daily", daily);

              getDailyTotal();
              editRow[index] = false;
            }}
          >
            Save
          </Button>
          <Button
            kind="tertiary"
            class="text-sm py-0.5 h-6 ml-2"
            on:click={() => {
              item = oriRow[index];
              editRow[index] = false;
            }}
          >
            Cancel
          </Button>
        </div>
      {:else}
        <div class="py-3">
          <div class="flex">
            <div class="flex-1">
              {`Daily basic rental: ${item.flex ? `Week ${item.week}: Flex[${item.flex}]: ` : ``} $${format.currency(
                item.daily.gross
              )} x ${item.days} days`}
              <div class="text-gray-400 text-sm">
                Nett: ${format.currency(item.daily.nett)} x {item.days} days<br />
                Commission: ${format.currency(item.daily.profit)} x {item.days} days
              </div>
            </div>
            <div class="text-right w-20">
              {format.currency(item.total)}
              <div class="text-gray-400 text-sm">
                {format.currency(item.nett)}<br />
                {format.currency(item.profit)}
              </div>
            </div>
          </div>
          <div class="mt-2">
            <Button
              kind="tertiary"
              class="text-sm py-0.5 h-6"
              on:click={() => {
                editRow[index] = true;
                oriRow[index] = JSON.parse(JSON.stringify(item));
              }}
            >
              Edit
            </Button>
          </div>
        </div>
      {/if}
    {/each}
  </div>
  <div class="p-4 bg-red-50 border border-red-300 flex">
    <div class="flex-1">
      <TextInput labelText="Discount name for daily basic rental" bind:value={quote.add_discount_remark} />
    </div>
    <div class="w-20 ml-2">
      <NumberInput
        label="Gross"
        bind:value={quote.add_discount_supplier}
        step={0.01}
        hideSteppers
        on:keyup={getDailyTotal}
        class="text-right"
      />
    </div>
    <div class="w-20 ml-2">
      <NumberInput
        label="Comm."
        bind:value={quote.add_discount}
        step={0.01}
        hideSteppers
        on:keyup={getDailyTotal}
        class="text-right"
      />
    </div>
  </div>
  <div class="p-4">
    <div class="flex mb-2">
      <div class="flex-1 font-bold">Total Daily Rental Fee</div>
      <div class="text-right">
        {format.currency(quote.details.daily.gross)}
      </div>
    </div>
    <div class="flex mb-2 text-sm text-gray-400">
      <div class="flex-1">Total Nett</div>
      <div class="text-right">
        {format.currency(quote.details.daily.nett)}
      </div>
    </div>
    <div class="flex mb-2 text-sm text-gray-400">
      <div class="flex-1">Total Commission</div>
      <div class="text-right">
        {format.currency(quote.details.daily.profit)}
      </div>
    </div>
  </div>
</div>
