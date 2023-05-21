<script>
  import { Button, Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";

  export let data;
  export let form;
  console.log(data);
  console.log(form);
</script>

{#if !form}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No booking detail</div>
      <Button href="/search">Back to search</Button>
    </div>
  </div>
{:else}
  <div class="p-4 bg-white">
    <div class="mx-auto max-w-3xl p-4">
      <h1 class="text-2xl mb-5">Customer Details</h1>
      <form
        method="post"
        action="/api/email"
        class="bg-white rounded-lg p-6 space-y-6"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="space-y-1">
            <TextInput name="first_name" labelText="First Name" required />
          </div>
          <div class="space-y-1">
            <TextInput name="last_name" labelText="Last Name" required />
          </div>
        </div>
        <div class="space-y-1">
          <TextInput name="email" labelText="Email" type="email" required />
        </div>
        <div class="space-y-1">
          <TextInput name="phone" labelText="Phone" required />
        </div>
        <div class="space-y-1">
          <Select labelText="Country" name="country">
            {#each data.countries as country}
              <SelectItem value={country.name} />
            {/each}
          </Select>
        </div>
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  </div>
{/if}
