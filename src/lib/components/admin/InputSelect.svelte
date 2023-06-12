<script>
  import { Select, SelectItem } from "carbon-components-svelte";

  export let name = "";
  export let label = "";
  export let value = "";
  export let options = [];
  export let half = false;
  export let required = false;
  export let no_blank = false;
  export let size = "standard"

  // console.log(value);

  if (no_blank && !value) {
    value = options[0].id
  }
  if (!value) {
    value = ""
  }
</script>

<div class={half ? "" : "md:col-span-2"}>
  <Select {name} labelText={label} bind:selected={value} {required}>
    {#if !no_blank}
      <option value="">Select {label}</option>
    {/if}
    {#each options as item}
      <SelectItem value={item.id} text={item.name} />
    {/each}
  </Select>
</div>

