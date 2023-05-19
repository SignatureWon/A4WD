<script>
  import { PasswordInput } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let half = false;
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <PasswordInput {name} labelText={label} bind:value {required} />
</div>
