<script>
  import { format } from "$lib/format.js";
  import { Button } from "carbon-components-svelte";
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher()
  export let detail = {};
  export let quote = {
    bonds: {
      gross: 0,
      nett: 0,
      items: [],
    },
  };

  const checkCap = (duration, cap) => {
    return cap > duration ? duration : cap;
  };
  const calculatePrice = (gross, duration, cap) => {
    gross = gross || 0;
    cap = cap || 0;

    let days = checkCap(duration, cap);

    return gross * days;
  };

  let selectedBond = 0;
  let showBondDetail = false;
</script>

<div class="pt-10">
  <div class="mb-2">
    <div class="uppercase tracking-wider font-bold mb-1 flex justify-between">
      Accident Liability
    </div>
    <div>Select your level of liability from the options below</div>
  </div>
  <div class="flex">
    {#each detail.bond_items as b, i}
      <div
        class="border {selectedBond === i
          ? 'border-brand-600 bg-brand-50'
          : 'border-gray-200'} p-3 flex-1 flex flex-col m-2"
      >
        <div class="flex-1 pb-8">
          <h4 class="font-bold text-brand-600">{b.display_name}</h4>
          <div class="text-xl font-bold">
            AUD ${format.currency(
              calculatePrice(b.gross, detail.duration, b.cap)
            )}
          </div>
          <div class="mb-4">
            ${format.currency(b.gross || 0)} x {checkCap(
              detail.duration,
              b.cap
            )} days
          </div>
          <div class="mb-4 font-bold">
            ${format.currency(b.liability)} Excess<br />
            ${format.currency(b.bond)} Bond
          </div>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="cursor-pointer text-brand-600 text-sm"
            on:click={() => (showBondDetail = !showBondDetail)}
          >
            {showBondDetail ? "Hide " : "Show "}
            Details
          </div>
          {#if showBondDetail}
            {#if b.description}
              <div class="mb-4 text-gray-500">
                {b.description}
              </div>
            {/if}
            {#if b.inclusions}
              <div class="font-bold">Inclusions</div>
              {b.inclusions}
            {/if}
          {/if}
        </div>
        {#if selectedBond === i}
          <Button>Selected</Button>
        {:else}
          <Button
            kind="tertiary"
            on:click={() => {
              selectedBond = i;
              quote.bonds = {
                gross: calculatePrice(b.gross, detail.duration, b.cap),
                nett: calculatePrice(b.nett, detail.duration, b.cap),
                items: b,
              };
              dispatch('change', quote);
            }}>Select</Button
          >
        {/if}
      </div>
    {/each}
  </div>
</div>
