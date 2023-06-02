<script>
  import { format } from "$lib/format.js";
  export let one_way;
  export let other;
  const getCcs = () => {
    let fee = (getTotalAgentFee() * 2) / 100;
    if (fee > 0) {
      agentFees.push({
        name: "Credit card surcharge (2%)",
        total: fee,
        nett: 0,
        profit: 0,
      });
    }
  };
</script>

{#if one_way > 0}
  <div class="border-b border-gray-200 py-3">
    <div class="flex mb-2">
      <div class="flex-1">One-way fee</div>
      <div class="text-right">
        {format.currency(one_way)}
      </div>
    </div>
  </div>
{/if}
{#if other.items.length}
  {#each other.items as item}
    <div class="border-b border-gray-200 py-3">
      <div class="flex mb-2">
        <div class="flex-1">{item.name}</div>
        <div class="text-right">
          {format.currency(item.fee)}
        </div>
      </div>
    </div>
  {/each}
{/if}

{#if !other.items.length && one_way === 0}
  <div class="border border-gray-200 p-8 text-center">No other fees</div>
{/if}
