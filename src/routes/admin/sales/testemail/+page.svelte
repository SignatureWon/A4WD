<script>
  import { Button } from "carbon-components-svelte";
  // import { html } from "$lib/email/confirmation.js";
  import { html } from "$lib/email/quotation.js";
  // import { html } from "$lib/email/provisional.js";
  // import { html } from "$lib/email/final.js";
  // import { html } from "$lib/email/booking.js";
  import { onMount } from "svelte";

  let email = "";
  onMount(async () => {
    email = await html.create(1175);
  });
</script>

<form action="?/email" method="POST">
  <Button type="submit" class="w-full">Test Send</Button>
</form>

{@html email}
