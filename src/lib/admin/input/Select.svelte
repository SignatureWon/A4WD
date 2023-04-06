<script>
  import { Select, SelectItem } from "carbon-components-svelte";

  export let key = "";
  export let field = {};
  export let data = {};
</script>

<Select
  labelText={field.label}
  name={key}
  bind:selected={data[key]}
  required={field.required}
>
  <SelectItem value="" text="Select {field.label}" />
  {#each field.options as option}
    <SelectItem value={option.id} text={option.name} />
  {/each}
</Select>
