<script>
  import { TextArea } from "carbon-components-svelte";

  export let field = {};
  export let record = {};
</script>

<TextArea
  labelText={field.label}
  name={field.name}
  placeholder={field.placeholder}
  bind:value={record[field.name]}
/>
