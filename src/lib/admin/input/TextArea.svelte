<script>
  import { TextArea } from "carbon-components-svelte";

  export let field = {};
  export let data = {};
</script>

<TextArea
  labelText={field.label}
  name={field.name}
  placeholder={field.placeholder}
  bind:value={data[field.name]}
  required={field.required}
/>
