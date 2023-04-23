<script>
  import { Select, SelectItem } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let options = [];
  export let half = false;
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <Select {name} labelText={label} bind:selected={value} {required}>
    <SelectItem value="" text="Select {name}" />
    {#each options as item}
      <SelectItem value={item.id} text={item.name} />
    {/each}
  </Select>
</div>
