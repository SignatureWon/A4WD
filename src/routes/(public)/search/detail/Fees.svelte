<script>
  import { format } from "$lib/format.js";
  import dayjs from "dayjs";

  //   export let search = {}
  export let detail = {};

  let showFeeDetails = false;

  const showDiscountType = (type, days) => {
    if (type === "Early bird") {
      return `Early bird (${days} days)`;
    } else if (type === "Long term") {
      return `Long term (${item.days} days)`;
    } else if (type === "Every X day") {
      return `Every (${item.days} day)`;
    }
  };
  const showDiscountFactor = (factor, value) => {
    if (factor === "Percentage") {
      return `Discount ${value}%`;
    } else if (factor === "Price") {
      return `Discount $${value}`;
    } else if (factor === "Day") {
      return `Discount ${item.value} ${item.value > 1 ? "days" : "day"}`;
    } else if (factor === "No One Way Fee") {
      return `No One Way Fee`;
    }
  };
</script>

<div class="divide-y divide-gray-200">
  <div>
    <div class="flex justify-between py-2">
      <div>
        Daily Rental ({detail.duration} days)
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <span
          class="cursor-pointer text-brand-600 text-sm"
          on:click={() => (showFeeDetails = !showFeeDetails)}>Details</span
        >
      </div>
      <div class="whitespace-nowrap pl-4">${format.currency(detail.gross)}</div>
    </div>
    <div
      class="col-span-2 text-sm text-gray-400 {showFeeDetails
        ? 'block'
        : 'hidden'}"
    >
      {#each detail.list as item, index}
        <div class="flex justify-between mb-2">
          <div>
            Day {index + 1} ({item.flex}): {dayjs(item.day).format(
              "DD/MM/YYYY"
            )}
          </div>
          <div class="whitespace-nowrap pl-4">
            ${format.currency(item.gross)}
          </div>
        </div>
      {/each}
    </div>
    {#if detail.min_days > detail.duration}
      <div
        class="col-span-2 bg-amber-50 p-3 text-sm text-amber-600 rounded mb-3"
      >
        Price is based on minimum {detail.min_days} days, less days will average
        out.
      </div>
    {/if}
  </div>
  {#if detail.one_way > 0}
    <div class="flex justify-between py-2">
      <div>One-way Fee</div>
      <div class="whitespace-nowrap pl-4">
        ${format.currency(detail.one_way)}
      </div>
    </div>
  {/if}
  {#if detail.fee_total > 0}
    {#each detail.fee_items as item}
      <div class="flex justify-between py-2">
        <div>{item.name}</div>
        <div class="whitespace-nowrap pl-4">
          ${format.currency(item.fee)}
        </div>
      </div>
    {/each}
  {/if}
  {#if detail.special_total > 0}
    {#each detail.special_items as item}
      <div>
        <div class="col-span-2 flex font-semibold tracking-wide pt-2">
          Deduct: {item.name}
        </div>
        <div class="flex justify-between py-2">
          <div>
            <div>
              {showDiscountType(item.type, item.days)}
              {showDiscountFactor(item.factor, item.value)}
            </div>
            <div class="text-sm text-gray-400">
              {item.description}
            </div>
          </div>
          <div class="whitespace-nowrap pl-4">
            - ${format.currency(item.discount_amount)}
          </div>
        </div>
        {#if item.discount2}
          <div class="flex justify-between py-2">
            <div>
              <div>
                {showDiscountType(item.type2, item.days2)}
                {showDiscountFactor(item.factor2, item.value2)}
                </div>
            </div>
            <div class="whitespace-nowrap pl-4">
              - ${format.currency(item.discount_amount2)}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  {/if}
</div>
