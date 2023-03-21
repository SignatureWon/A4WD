<script>
  import { NumberInput } from "carbon-components-svelte";

  export let field = {};
  export let record = {};
</script>

<NumberInput
  label={field.label}
  name={field.name}
  bind:value={record[field.name]}
  step={field.step || 1}
/>
