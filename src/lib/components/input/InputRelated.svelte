<script>
  import { Select, SelectItem } from "carbon-components-svelte";

  export let field = {};
  export let record = {};
  export let getRelated = () => {};
</script>

<Select
  labelText={field.label}
  name={field.name}
  bind:selected={record[field.name]}
  required={field.required || false}
>
  <SelectItem value="" text="Select {field.name}" />
  {#await getRelated(field.related, field.filters) then related}
    {#each related as option}
      <SelectItem value={option.id} text={option.name} />
    {/each}
  {/await}
</Select>
