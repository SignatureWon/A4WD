<script>
  import { format } from "$lib/format.js";
  export let data;
  export let search;
  export let count;
  let selected = 0;
  let showBondDetail = false;

  const checkCap = (duration, cap) => {
    if (!cap) {
      cap = 0;
    }
    return cap > duration || cap === 0 ? duration : cap;
  };
  const calculatePrice = (gross, duration, cap) => {
    gross = gross || 0;
    cap = cap || 0;

    let days = checkCap(duration, cap);

    return gross * days;
  };
</script>

{#if data.bond_items.length > 0}
  <div class="bg-white rounded mb-4">
    <div class="px-4 py-2 border-b border-gray-200">
      <h2 class="h2">Accident Liability</h2>
      <div class="text-gray-500">Select your level of liability from the options below</div>
    </div>
    <div class="px-2">
      <div class="md:flex">
        {#each data.bond_items as item, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="group cursor-pointer flex-1 flex flex-col m-2 p-2 border hover:border-brand-600 hover:bg-brand-50 {selected ===
            index
              ? 'border-brand-600 bg-brand-50'
              : 'border-gray-200'}"
            on:click={() => {
              selected = index;
              data.bonds = item;
              count();
            }}
          >
            <div class="flex-1">
              <h3 class="font-bold text-brand-600">{item.display_name}</h3>
              <div class="text-lg font-bold">
                ${format.currency(calculatePrice(item.gross, search.duration, item.cap))}
              </div>
              <div class="mb-4">
                ${format.currency(item.gross || 0)} x {checkCap(search.duration, item.cap)} days
              </div>
              {#if item.gross > item.nett && item.nett > 0}
                <div class="mb-4">
                  <div class="text-gray-400 text-sm">
                    Nett: ${format.currency(item.nett)} x {checkCap(search.duration, item.cap)} = ${format.currency(calculatePrice(item.nett, search.duration, item.cap))}
                  </div>
                  <div class="text-gray-400 text-sm">
                    Comm: ${format.currency(item.gross - item.nett)} x {checkCap(search.duration, item.cap)} = ${format.currency(calculatePrice((item.gross - item.nett), search.duration, item.cap))}
                  </div>
                </div>
              {/if}
            </div>
            <div>
              <div class="mb-4 font-bold">
                ${format.currency(item.liability, 0)} Excess<br />
                ${format.currency(item.bond, 0)} Bond
              </div>

              {#if selected === index}
                <div class="w-full border border-brand-500 py-1.5 text-center font-semibold text-white bg-brand-500">
                  Selected
                </div>
              {:else}
                <div
                  class="w-full border border-brand-500 py-1.5 text-center font-semibold text-brand-500 group-hover:text-white group-hover:bg-brand-500"
                >
                  Select
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
