<script>
  import { Toggle } from "carbon-components-svelte";

  export let field = {};
  export let record = {};

  // console.log(field);
  // console.log(record);
  // console.log(record[field.name]);
</script>

<Toggle
  labelA={field.label}
  labelB={field.label}
  bind:toggled={record[field.name]}
/>
