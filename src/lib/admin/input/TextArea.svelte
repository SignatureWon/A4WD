<script>
  import { TextArea } from "carbon-components-svelte";

  export let key = "";
  export let field = {};
  export let data = {};
</script>
<TextArea
  labelText={field.label}
  name={field.name}
  placeholder={field.placeholder}
  bind:value={data[key]}
  required={field.required}
/>
