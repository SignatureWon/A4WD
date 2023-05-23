<script>
  import { format } from "$lib/format.js";
    import dayjs from "dayjs";

  export let detail = {};
  export let quote = {};

  let t = detail.terms

  let deposit = {
    show: false,
    percentage: 0,

  }

  let balance = {
    show: false,

  }

  if (t.pay_counter) {
    showBalance = true

  }


</script>

<section class="bg-white my-8">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">Payment Details</h2>
  </div>
  <div class="p-4">
    <div class="uppercase tracking-wider font-bold mb-3 flex justify-between">
      <div>Payment</div>
      <div>AUD $</div>
    </div>
    <div class="divide-y divide-gray-200">
      <div class="flex justify-between py-2">
        <div>
          Booking Deposit ({detail.terms.percentage
            ? `${detail.terms.deposit}%`
            : `$${detail.terms.deposit}`})
          {#if detail.terms.description}
            <div class="text-gray-400 text-sm">
              {detail.terms.description}
            </div>
          {/if}
        </div>
        <div>
          {#if detail.terms.percentage}
            ${format.currency((quote.gross * detail.terms.deposit) / 100)}
          {:else}
            ${format.currency(detail.terms.deposit)}
          {/if}
        </div>
      </div>
      {#if detail.terms.payment2}
        <div class="flex justify-between py-2">
          <div>
            1st Payment ({detail.terms.percentage2
              ? `${detail.terms.deposit2}%`
              : `$${detail.terms.deposit2}`} - {detail.terms.balance2} days before
            travel)
            {#if detail.terms.description2}
              <div class="text-gray-400 text-sm">
                {detail.terms.description2}
              </div>
            {/if}
          </div>
          <div>
            {#if detail.terms.percentage2}
              ${format.currency((quote.gross * detail.terms.deposit2) / 100)}
            {:else}
              ${format.currency(detail.terms.deposit2)}
            {/if}
          </div>
        </div>
      {/if}
      {#if detail.terms.payment3}
        <div class="flex justify-between py-2">
          <div>
            2nd Payment ({detail.terms.percentage3
              ? `${detail.terms.deposit3}%`
              : `$${detail.terms.deposit3}`} - {detail.terms.balance3} days before
            travel)
            {#if detail.terms.description3}
              <div class="text-gray-400 text-sm">
                {detail.terms.description3}
              </div>
            {/if}
          </div>
          <div>
            {#if detail.terms.percentage3}
              ${format.currency((quote.gross * detail.terms.deposit3) / 100)}
            {:else}
              ${format.currency(detail.terms.deposit3)}
            {/if}
          </div>
        </div>
      {/if}
      <div class="flex justify-between py-2">
        <div>
          Balance ({detail.terms.pay_counter
            ? "Pay at pick-up counter"
            : `${detail.terms.balance} days before travel`})
        </div>
        <div>
          ${format.currency(
            quote.gross -
              (detail.terms.percentage
                ? (quote.gross * detail.terms.deposit) / 100
                : detail.terms.deposit) -
              (detail.terms.percentage2
                ? (quote.gross * (detail.terms.deposit2 || 0)) / 100
                : detail.terms.deposit2 || 0) -
              (detail.terms.percentage3
                ? (quote.gross * (detail.terms.deposit3 || 0)) / 100
                : detail.terms.deposit3 || 0)
          )}
        </div>
      </div>
    </div>
  </div>
</section>
