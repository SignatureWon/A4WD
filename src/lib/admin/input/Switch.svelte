<script>
  import { Toggle } from "carbon-components-svelte";

  export let key = "";
  export let field = {};
  export let data = {};
</script>

<Toggle
  name={key}
  labelText={field.label}
  labelA={field.options || "No"}
  labelB={field.options || "Yes"}
  bind:toggled={data[key]}
  required={field.required}
/>
