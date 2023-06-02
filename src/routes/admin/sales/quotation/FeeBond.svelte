<script>
  import { format } from "$lib/format.js";
  import { RadioButton, RadioButtonGroup } from "carbon-components-svelte";
  export let fees;
  export let list;
  export let duration;
  export let bonds;
  export let selected;

  let gross = list[selected].gross * (duration < (list[selected].cap || 0) ? duration : list[selected].cap || 0);
  let nett = list[selected].nett * (duration < (list[selected].cap || 0) ? duration : list[selected].cap || 0);
  fees = {
    name: `${list[selected].display_name}: $${format.currency(list[selected].gross)} x ${duration} days`,
    total: gross,
    nett: nett,
    profit: gross - nett,
    day: duration,
  };
</script>

<div class="border-b border-gray-200 py-3">
  <RadioButtonGroup orientation="vertical" selected={0} class="w-full [&>fieldset]:w-full">
    {#each list as b, i}
      <div class="flex mb-2 justify-between w-full pt-2 pb-3">
        <div class="flex-1 flex justify-start">
          <RadioButton
            labelText={`${b.display_name} - ${b.liability.toLocaleString("en-US")} Excess, ${b.bond.toLocaleString(
              "en-US"
            )} Bond (${format.currency(b.gross || 0)} x ${
              b.cap ? (b.cap > duration ? duration : b.cap) : duration
            } days)                
          `}
            value={i}
            on:change={() => {
              selected = i;
              let gross = b.gross * (duration < (b.cap || 0) ? duration : b.cap || 0);
              let nett = b.nett * (duration < (b.cap || 0) ? duration : b.cap || 0);
              fees = {
                name: `${b.display_name}: $${format.currency(b.gross)} x ${duration} days`,
                total: gross,
                nett: nett,
                profit: gross - nett,
                day: duration,
              };

              bonds = b;
              //   updateQuote();
              // console.log(details);
            }}
          />
        </div>
        <div class="whitespace-nowrap pl-4">
          ${format.currency((b.gross || 0) * (b.cap ? (b.cap > duration ? duration : b.cap) : duration))}
        </div>
      </div>
      {#if b.gross > b.nett && b.nett !== 0}
        <div class="flex w-full mb-2 justify-between text-sm text-gray-400">
          <div class="pl-7">
            Nett: ${b.nett} x {duration} days
          </div>
          <div class="whitespace-nowrap pl-4">
            ${format.currency((b.nett || 0) * (b.cap ? (b.cap > duration ? duration : b.cap) : duration))}
          </div>
        </div>
        <div class="flex w-full mb-2 justify-between text-sm text-gray-400">
          <div class="pl-7">
            Commission: ${format.currency(b.gross - b.nett)} x {duration} days
          </div>
          <div class="whitespace-nowrap pl-4">
            ${format.currency((b.gross - b.nett || 0) * (b.cap ? (b.cap > duration ? duration : b.cap) : duration))}
          </div>
        </div>
      {/if}
    {/each}
  </RadioButtonGroup>
</div>
