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
        <Select
          labelText="License"
          name="license"
          bind:selected={quote.details.driver.license}
          required
          on:change={(e) => {
            const selected = licenses.options.filter((item) => {
              return item.name === e.target.value;
            })[0]
            quote.details.license.name = selected.name
            quote.details.license.id = selected.id
          }}
        >
          <SelectItem value="" text="Select license" />
          {#each licenses.options as license}
            <SelectItem value={license.name} />
          {/each}
        </Select>
      </div>
      <div>
        <TextInput labelText="Age" name="age" type="number" bind:value={quote.details.driver.age} required />
      </div>
    </div>
  </div>
</div>
