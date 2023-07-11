<script>
  import { format } from "$lib/format.js";
  import { Button } from "carbon-components-svelte";
  export let quote;
</script>

<div
  class="bg-white fixed bottom-0 left-0 w-full p-4 border-t border-gray-200 z-50"
  style="box-shadow: 0 0 20px rgba(0,0,0,.2);"
>
  <div class="flex items-center">
    <div class="flex-1 font-bold text-lg">
      Total: ${format.currency(quote.agent_fee + quote.supplier_fee)}
    </div>
    <div>
      <form method="POST">
        <Button type="submit">Get Instant Quote</Button>
        <input type="hidden" name="quote" value={JSON.stringify(quote)} />
      </form>
    </div>
  </div>
</div>
