<script>
  import { TextInput } from "carbon-components-svelte";

  export let field = {};
  export let record = {};
</script>

<TextInput
  labelText={field.label}
  name={field.name}
  placeholder={field.placeholder}
  bind:value={record[field.name]}
  required={field.required || false}
/>
