<script>
  import { TextArea } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let helper = "";
  export let half = false;
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <TextArea {name} labelText={label} bind:value {required} helperText={helper} />
</div>
