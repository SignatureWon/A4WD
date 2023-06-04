<script>
  import { NumberInput, Select, SelectItem } from "carbon-components-svelte";
  export let driver;
  export let licenseOptions;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
  <div>
    <Select name="license" labelText="License" bind:value={driver.license}>
      {#each licenseOptions as license}
        <SelectItem value={license.name} />
      {/each}
    </Select>
  </div>
  <div>
    <NumberInput name="age" label="Age" bind:value={driver.age} allowEmpty required />
  </div>
</div>
