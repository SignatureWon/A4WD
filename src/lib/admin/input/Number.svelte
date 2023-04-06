<script>
  import { NumberInput } from "carbon-components-svelte";

  export let key = "";
  export let field = {};
  export let data = {};
</script>

<NumberInput
  label={field.label}
  name={key}
  bind:value={data[key]}
  step={field.options || 1}
  required={field.required}
/>
