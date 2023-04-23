<script>
  import { NumberInput } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let half = false;
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <NumberInput allowEmpty {name} {label} bind:value {required} />
</div>
