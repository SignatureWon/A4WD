<script>
  import { Select, SelectItem } from "carbon-components-svelte";
  import { db } from "$lib/db";

  export let key = "";
  export let field = {};
  export let data = {};
</script>

<Select
  labelText={field.label}
  name={key}
  bind:selected={data[key]}
  required={field.required || false}
>
  <SelectItem value="" text="Select {field.label}" />
  {#await db.all({ from: field.related, select: "id, name" }) then related}
    {#each related as option}
      <SelectItem value={option.id} text={option.name} />
    {/each}
  {/await}
</Select>
