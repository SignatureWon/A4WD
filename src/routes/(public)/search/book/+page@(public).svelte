<script>
  import {
    Button,
    Select,
    SelectItem,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";

  export let data;
  export let form;
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
        action="/search/book/confirm"
        class="bg-white rounded-lg p-6 space-y-6"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <TextInput
              name="first_name"
              labelText="First Name"
              value={form.user.first_name}
              required
            />
          </div>
          <div>
            <TextInput
              name="last_name"
              labelText="Last Name"
              value={form.user.last_name}
              required
            />
          </div>
        </div>
        <div>
          <TextInput
            name="email"
            labelText="Email"
            type="email"
            value={form.user.email}
            required
            readonly
            title="Not editable"
          />
        </div>
        <div>
          <TextInput
            name="phone"
            labelText="Phone"
            value={form.user.phone}
            required
          />
        </div>
        <div>
          <Select labelText="Country" name="country" value={form.user.country}>
            {#each data.countries as country}
              <SelectItem value={country.name} />
            {/each}
          </Select>
        </div>
        <div>
          <TextArea
            name="comment"
            labelText="Your travel comment"
            value={form.user.comment}
          />
        </div>
        <div class="text-center">
          <Button type="submit" class="px-10">Send Quote</Button>
        </div>
        <input type="hidden" name="user_id" value={form.user.id || ""}>
        <input type="hidden" name="data" value={JSON.stringify(form.postData)}>
      </form>
    </div>
  </div>
{/if}
