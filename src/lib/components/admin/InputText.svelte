<script>
  import { TextInput } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let helper = "";
  export let type = "text";
  export let half = false;
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <TextInput {name} labelText={label} {type} bind:value {required} helperText={helper} />
</div>
