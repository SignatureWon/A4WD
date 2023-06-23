<script>
  import { Button } from "carbon-components-svelte";
  import { html } from "$lib/email/quotation.js";
  import { onMount } from "svelte";

  let email = "";
  onMount(async () => {
    email = await html.create(163);
  });
</script>

<form action="?/email" method="POST">
  <Button type="submit" class="w-full">Test Send</Button>
</form>

{@html email}
