<script>
  import { format } from "$lib/format.js";
  export let specials;
  export let fees;

  specials.items.forEach((item) => {
    if (item.discount_amount > 0) {
      fees.push({
        name: item.name,
        total: item.discount_amount,
        nett: 0,
        profit: 0,
      });
    }
  });
</script>

{#if specials.items.length}
  {#each specials.items as item}
    {#if item.discount_amount > 0}
      <div class="border-b border-gray-200 py-3">
        <div class="flex mb-2">
          <div class="flex-1">{item.name}</div>
          <div class="text-right">
            -${format.currency(item.discount_amount)}
          </div>
        </div>
      </div>
    {/if}
  {/each}
{:else}
  <div class="border border-gray-200 p-8 text-center">No specials</div>
{/if}
