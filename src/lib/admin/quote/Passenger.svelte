<script>
  import { NumberInput, Select, SelectItem } from "carbon-components-svelte";
  export let passenger;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
  <div>
    <NumberInput name="adult" label="No. of Adult" bind:value={passenger.adult} allowEmpty required />
  </div>
  <div>
    <NumberInput name="children" label="No. of Children" bind:value={passenger.children} allowEmpty required />
  </div>
</div>
