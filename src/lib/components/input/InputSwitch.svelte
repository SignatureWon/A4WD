<script>
  import { Toggle } from "carbon-components-svelte";

  export let field = {};
  export let record = {};

  // console.log(field);
  // console.log(record);
  // console.log(record[field.name]);
</script>

<Toggle
  labelText={field.label}
  labelA={field.toggle || "No"}
  labelB={field.toggle || "Yes"}
  bind:toggled={record[field.name]}
/>
