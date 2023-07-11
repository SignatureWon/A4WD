<script>
  import { html } from "$lib/final.js";
  import { onMount } from "svelte";

  let email = ""
  onMount(async () => {
    email = await html.create(78)
  })
</script>

{@html email}
