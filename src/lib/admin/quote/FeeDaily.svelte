<script>
  import { format } from "$lib/format.js";
  import { Button, Modal, NumberInput, TextInput } from "carbon-components-svelte";
  export let fees;
  export let daily;
  export let type;
  export let quote;
  export let count;

  let open = false;
  let editData = {
    flex: "",
    daily: {
      gross: 0,
      nett: 0,
    },
  };
  let editRow = [];
  let tempData = [];

  let td = {};

  const getDailyRates = () => {
    fees = [];
    let arr = daily.items;
    let temp = {};

    // console.log("arr", arr);
    if (type === "flex") {
      // console.log(arr);
      let week = 1;
      let day = 0;
      arr.forEach((o, i) => {
        editRow.push(false);
        if (i !== 0 && i % 7 === 0) {
          temp = {
            // name: `Daily basic rental: Week ${week}: Flex[${arr[i - 1].flex}]: $${format.currency(
            //   arr[i - 1].gross
            // )} x ${day} days`,
            total: arr[i - 1].gross * day,
            nett: arr[i - 1].nett * day,
            profit: arr[i - 1].profit * day,
            day: day,
            week: week,
            flex: arr[i - 1].flex,
            daily: {
              gross: arr[i - 1].gross,
              nett: arr[i - 1].nett,
              profit: arr[i - 1].profit,
            },
          };
          fees = [...fees, temp];
          tempData = [...tempData, temp];
          day = 1;
          week++;
        } else {
          day++;
        }
        if (i === arr.length - 1) {
          temp = {
            // name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
            total: o.gross * day,
            nett: o.nett * day,
            profit: o.profit * day,
            day: day,
            week: week,
            flex: o.flex,
            daily: {
              gross: o.gross,
              nett: o.nett,
              profit: o.profit,
            },
          };
          tempData = [...tempData, temp];
          fees = [...fees, temp];
        }
      });
    } else {
      editRow.push(false);
      temp = {
        // name: `Daily basic rental: $${format.currency(daily.gross / arr.length)} x ${arr.length} days`,
        total: daily.gross,
        nett: daily.nett,
        profit: daily.profit,
        week: 1,
        day: arr.length,
        daily: {
          gross: daily.gross / arr.length,
          nett: daily.nett / arr.length,
          profit: daily.profit / arr.length,
        },
      };
      fees = [...fees, temp];
      tempData = [...tempData, temp];
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

    if (quote.add_discount > 0) {
      quote.add_discount = 0;
    }

    subtotal.total += quote.add_discount;
    subtotal.profit += quote.add_discount;

    count();
  };
  $: getDailyRates();
  $: getDailyTotal();
</script>

{#each fees as item, itemIndex}
  {#if editRow[itemIndex]}
    <div class="grid grid-cols-3 gap-2 py-4">
      {#if td[`t${itemIndex}`].flex}
        <TextInput bind:value={td[`t${itemIndex}`].flex} labelText="Flex" />
      {/if}
      <NumberInput bind:value={td[`t${itemIndex}`].gross} label="Gross" step={0.01} />
      <NumberInput bind:value={td[`t${itemIndex}`].nett} label="Nett" step={0.01} />
    </div>

    <div class="flex">
      <Button
        class="text-sm py-0.5 h-6"
        on:click={() => {
          let u = td[`t${itemIndex}`];
          // console.log("b4", daily.items);

          // console.log(item);

          item.total = u.gross * item.day;
          item.nett = u.nett * item.day;
          item.profit = item.total - item.nett;
          item.flex = u.flex;
          item.daily = {
            gross: u.gross,
            nett: u.nett,
            profit: u.gross - u.nett,
          };

          // console.log("after", item);

          daily.gross = item.total;
          daily.nett = item.nett;
          daily.profit = item.profit;

          let start = (item.week - 1) * 7;

          for (let i = start; i < start + item.day; i++) {
            daily.items[i].flex = u.flex;
            daily.items[i].gross = u.gross;
            daily.items[i].nett = u.nett;
            daily.items[i].profit = u.gross - u.nett;
          }

          // console.log(daily.items);
          count();
          editRow[itemIndex] = false;
        }}
      >
        Save
      </Button>
      <Button
        kind="tertiary"
        class="text-sm py-0.5 h-6 ml-2"
        on:click={() => {
          editRow[itemIndex] = false;
        }}
      >
        Cancel
      </Button>
    </div>
  {:else}
    <div class="border-b border-gray-200 py-3">
      <div class="flex mb-2">
        <div class="flex-1">
          {#if item.flex}
            Daily basic rental: Week {item.week}: Flex[{item.flex}]: ${format.currency(item.daily.gross)} x {item.day} days
          {:else}
            Daily basic rental: ${format.currency(item.daily.gross)} x {item.day} days
          {/if}
        </div>
        <div class="text-right">
          {format.currency(item.total)}
        </div>
      </div>
      <div class="flex mb-2 text-sm text-gray-400">
        <div class="flex-1">
          Nett: ${format.currency(item.daily.nett)} x {item.day} days
        </div>
        <div class="text-right">
          {format.currency(item.nett)}
        </div>
      </div>
      <div class="flex mb-2 text-sm text-gray-400">
        <div class="flex-1">
          Commission: ${format.currency(item.daily.profit)} x {item.day} days
        </div>
        <div class="text-right">
          {format.currency(item.profit)}
        </div>
      </div>
      <div>
        <Button
          kind="tertiary"
          class="text-sm py-0.5 h-6"
          on:click={() => {
            td[`t${itemIndex}`] = {};
            td[`t${itemIndex}`].gross = item.daily.gross;
            td[`t${itemIndex}`].nett = item.daily.nett;
            td[`t${itemIndex}`].flex = item.flex || null;
            editRow[itemIndex] = true;
          }}
        >
          Edit
        </Button>
      </div>
    </div>
  {/if}
{/each}
<div class="flex border-b border-gray-200 py-3 bg-gray-100 px-2">
  <div class="flex-1">
    <TextInput placeholder="Discount for daily basic rental" bind:value={quote.add_discount_remark} />
  </div>
  <div class="text-right w-20">
    <NumberInput bind:value={quote.add_discount} max={0} hideSteppers on:keyup={getDailyTotal} class="text-right" />
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
