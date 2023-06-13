<script>
  import { supabase } from "$lib/supabaseClient";
  import { Select, SelectItem, TextInput } from "carbon-components-svelte";
  import { onMount } from "svelte";
  export let quote;
  let licenses = {
    options: [],
  };

  onMount(async () => {
    const { data: optionData, error: optionError } = await supabase.rpc("search_options").select();
    licenses = optionData.filter((item) => {
      return item.name === "licenses";
    })[0];
  });
</script>

<div class="bg-white rounded mb-4">
  <h2 class="h2 px-4 py-2 border-b border-gray-200">Driver Information</h2>
  <div class="p-4 grid grid-cols-1 gap-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <Select labelText="Driver's License" name="license" bind:value={quote.details.driver.license} required>
          <SelectItem value="" text="Select license" />
          {#each licenses.options as license}
            <SelectItem value={license.name} />
          {/each}
        </Select>
      </div>
      <div>
        <TextInput labelText="Driver's Age" name="age" bind:value={quote.details.driver.age} required />
      </div>
    </div>
  </div>
</div>
