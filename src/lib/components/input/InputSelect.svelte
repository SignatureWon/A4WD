<script>
  import { Select, SelectItem } from "carbon-components-svelte";

  export let field = {};
  export let record = {};
</script>

<Select
  labelText={field.label}
  name={field.name}
  bind:selected={record[field.name]}
  required={field.required || false}
>
  <SelectItem value="" text="Select {field.name}" />
  {#each field.options as option}
    <SelectItem value={option.id} text={option.name} />
  {/each}
</Select>
