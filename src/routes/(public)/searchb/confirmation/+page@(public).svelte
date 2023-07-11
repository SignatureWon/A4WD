<script>
  import { html } from "$lib/confirmation.js";
  import { onMount } from "svelte";

  let email = ""
  onMount(async () => {
    email = await html.create(139)
  })
</script>

{@html email}
