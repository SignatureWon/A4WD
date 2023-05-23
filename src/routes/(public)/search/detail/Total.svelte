<script>
  import { format } from "$lib/format.js";
  export let quote = {
    gross: 0
  };
</script>
<div
  class="p-4 border-t border-gray-200 flex justify-between text-xl font-bold bg-white"
>
  <div>Total</div>
  <div>${format.currency(quote.gross)}</div>
</div>
