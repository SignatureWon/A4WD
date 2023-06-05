<script>
  import { html } from "$lib/confirmation.js";
  import { onMount } from "svelte";

  let email = ""
  onMount(async () => {
    email = await html.create(81)
  })
</script>

{@html email}
