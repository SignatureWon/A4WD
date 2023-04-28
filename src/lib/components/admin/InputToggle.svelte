<script>
  import { Toggle } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = false;
  export let a = null;
  export let b = null;
  export let half = false;
  export let required = false;

  if (!value) {
    value = false
  }
</script>

<div class={half ? "" : "md:col-span-2"}>
  <Toggle
    labelText={label}
    labelA={a || "No"}
    labelB={b || "Yes"}
    bind:toggled={value}
    {required}
  />
  <input type="hidden" {name} bind:value={value} />
</div>
