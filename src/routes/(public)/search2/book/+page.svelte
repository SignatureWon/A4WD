<script>
    import { Button, Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";
  
    export let data;
    // export let form;
  </script>
  
  {#if !data}
    <div class="p-4">
      <div class="px-4 py-20 text-center bg-white">
        <div class="mb-5">No booking detail</div>
        <Button href="/">Back to home</Button>
      </div>
    </div>
  {:else}
    <div class="p-4 bg-white">
      <div class="mx-auto max-w-3xl p-4">
        <h1 class="text-2xl mb-5">Customer Details</h1>
        <form method="post" action="/search/book/confirm" class="bg-white rounded-lg p-6 space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-6">
            <div>
              <Select name="title" labelText="Title" value={data.user.title} required>
                <SelectItem value="Mr." text="Mr." />
                <SelectItem value="Ms." text="Ms." />
                <SelectItem value="Mrs." text="Mrs." />
                <SelectItem value="Miss" text="Miss" />
                <SelectItem value="Dr." text="Dr." />
              </Select>
            </div>
            <div class="sm:col-span-2">
              <TextInput name="first_name" labelText="First Name" value={data.user.first_name} required />
            </div>
            <div class="sm:col-span-2">
              <TextInput name="last_name" labelText="Last Name" value={data.user.last_name} required />
            </div>
          </div>
          <div>
            <TextInput
              name="email"
              labelText="Email"
              type="email"
              value={data.user.email}
              required
              readonly
              title="Not editable"
            />
          </div>
          <div>
            <TextInput name="phone" labelText="Phone" value={data.user.phone} required />
          </div>
          <div class="font-bold text-lg pt-10">Home Address</div>
          <div>
            <TextInput name="address_1" labelText="Address 1" value={data.user.address_1} required />
          </div>
          <div>
            <TextInput name="address_2" labelText="Address 2" value={data.user.address_2} required />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <TextInput name="postcode" labelText="Postcode" value={data.user.postcode} required />
            </div>
            <div>
              <TextInput name="city" labelText="City" value={data.user.city} required />
            </div>
            <div>
              <TextInput name="state" labelText="State" value={data.user.state} required />
            </div>
            <div>
              <Select labelText="Country" name="country" value={data.user.country}>
                {#each data.countries as country}
                  <SelectItem value={country.name} />
                {/each}
              </Select>
            </div>
          </div>
          <div>
            <TextArea name="comment" labelText="Your travel comment" value="" />
          </div>
          <div class="text-center">
            <Button type="submit" class="px-10">Send Quote</Button>
          </div>
          <input type="hidden" name="user_id" value={data.user.id || ""} />
          <input type="hidden" name="data" value={JSON.stringify(data.postData)} />
        </form>
      </div>
    </div>
  {/if}
  