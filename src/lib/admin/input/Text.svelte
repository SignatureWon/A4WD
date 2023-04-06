<script>
  import { TextInput } from "carbon-components-svelte";

  export let key = "";
  export let field = {};
  export let data = {};
</script>

<TextInput
  labelText={field.label}
  name={key}
  placeholder={field.placeholder}
  bind:value={data[key]}
  required={field.required}
/>
