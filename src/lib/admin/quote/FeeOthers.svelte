<script>
  import { format } from "$lib/format.js";
  export let one_way;
  export let others;
  export let fees;

  // console.log(fees);

  if (one_way > 0) {
    fees.push({
      name: `One-way fee`,
      total: one_way,
      nett: 0,
      profit: 0,
    });
  }

  others.items.forEach(item => {
    fees.push({
      name: item.name,
      total: item.fee,
      nett: 0,
      profit: 0,
    });
  });
  //   const getOneways = () => {
  //     let one_way = details.one_way;
  //     if (one_way > 0) {
  //       supplierFees.push({
  //         name: `One-way fee`,
  //         total: one_way,
  //         nett: 0,
  //         profit: 0,
  //       });
  //       pickupFees.push({
  //         name: `One-way fee`,
  //         total: one_way,
  //         nett: 0,
  //         profit: 0,
  //       });
  //     }
  //   };
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
{#if others.items.length}
  {#each others.items as item}
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

{#if !others.items.length && one_way === 0}
  <div class="border border-gray-200 p-8 text-center">No other fees</div>
{/if}
