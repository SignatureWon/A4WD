<script>
  import { format } from "$lib/format.js";
  import { NumberInput, TextInput } from "carbon-components-svelte";
  export let fees;
  export let daily;
  export let type;
  export let quote;
  export let count;

  const getDailyRates = () => {
    fees = [];
    let arr = daily.items;
    if (type === "flex") {
      let week = 1;
      let day = 0;
      arr.forEach((o, i) => {
        if (i !== 0 && i % 7 === 0) {
          fees.push({
            name: `Daily basic rental: Week ${week}: Flex[${arr[i - 1].flex}]: $${format.currency(
              arr[i - 1].gross
            )} x ${day} days`,
            total: arr[i - 1].gross * day,
            nett: arr[i - 1].nett * day,
            profit: arr[i - 1].profit * day,
            day: day,
          });
          day = 1;
          week++;
        } else {
          day++;
        }
        if (i === arr.length - 1) {
          fees.push({
            name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
            total: o.gross * day,
            nett: o.nett * day,
            profit: o.profit * day,
            day: day,
          });
        }
      });
    } else {
      fees.push({
        name: `Daily basic rental: $${format.currency(daily.gross / arr.length)} x ${arr.length} days`,
        total: daily.gross,
        nett: daily.nett,
        profit: daily.profit,
        day: arr.length,
      });
    }
    count();
  };
  let subtotal;
  const getDailyTotal = () => {
    subtotal = {
      total: 0,
      nett: 0,
      profit: 0,
    };
    fees.forEach((item) => {
      subtotal.total += item.total;
      subtotal.nett += item.nett;
      subtotal.profit += item.profit;
    });

    subtotal.total -= quote.add_discount;
    subtotal.profit -= quote.add_discount;

    count();
  };
  $: getDailyRates();
  $: getDailyTotal();
</script>

{#each fees as item}
  <div class="border-b border-gray-200 py-3">
    <div class="flex mb-2">
      <div class="flex-1">
        {item.name}
      </div>
      <div class="text-right">
        {format.currency(item.total)}
      </div>
    </div>
    <div class="flex mb-2 text-sm text-gray-400">
      <div class="flex-1">
        Nett: ${format.currency(item.nett / item.day)} x {item.day} days
      </div>
      <div class="text-right">
        {format.currency(item.nett)}
      </div>
    </div>
    <div class="flex mb-2 text-sm text-gray-400">
      <div class="flex-1">
        Commission: ${format.currency(item.profit / item.day)} x {item.day} days
      </div>
      <div class="text-right">
        {format.currency(item.profit)}
      </div>
    </div>
  </div>
{/each}
<div class="flex border-b border-gray-200 py-3 bg-gray-100 px-2">
  <div class="flex-1">
    <TextInput placeholder="Discount for daily basic rental" bind:value={quote.add_discount_remark} />
  </div>
  <div class="text-right w-20">
    <NumberInput bind:value={quote.add_discount} hideSteppers on:keyup={getDailyTotal} class="text-right" />
  </div>
</div>
<div class="border-b border-gray-200 py-3 bg-gray-50 px-2">
  <div class="flex mb-2">
    <div class="flex-1 font-bold">Total Agent Fees</div>
    <div class="text-right">
      {format.currency(subtotal.total)}
    </div>
  </div>
  <div class="flex mb-2 text-sm text-gray-400">
    <div class="flex-1">Total Nett</div>
    <div class="text-right">
      {format.currency(subtotal.nett)}
    </div>
  </div>
  <div class="flex mb-2 text-sm text-gray-400">
    <div class="flex-1">Total Commission</div>
    <div class="text-right">
      {format.currency(subtotal.profit)}
    </div>
  </div>
</div>
