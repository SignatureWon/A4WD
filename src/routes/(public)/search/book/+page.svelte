<script>
  import { Button, NumberInput, Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";
  import Trip from "../detail/Trip.svelte";

  export let data;
  let quote = data.quote;
  // console.log("quote", data);
  if (quote) {
    quote.status = "Request";
    quote.comment = null;
    quote.details.driver = {
      age: null,
      license: null,
    };
    quote.details.passenger = {
      adult: 1,
      children: 0,
    };
    quote.code_promo = null;
    quote.code_affiliate = null;
  }

  const user = {
    title: "Mr.",
    first_name: null,
    last_name: null,
    phone: null,
    email: null,
    address_1: null,
    address_2: null,
    postcode: null,
    city: null,
    state: null,
    country: "Australia",
  };
</script>

{#if !quote}
  <div class="p-4">
    <div class="px-4 py-20 text-center bg-white">
      <div class="mb-5">No booking detail</div>
      <Button href="/">Back to home</Button>
    </div>
  </div>
{:else}
  <div class="p-4">
    <div class="mx-auto max-w-3xl p-4">
      <h1 class="h1 mb-5">Rental Information</h1>
      <Trip {quote} action={false} />

      <form method="POST">
        <div class="bg-white rounded mb-4">
          <div class="px-4 py-2 border-b border-gray-200">
            <h2 class="h2">Customer Details</h2>
          </div>
          <div class="p-5 grid grid-cols-1 gap-4">
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div>
                <Select name="title" labelText="Title" bind:selected={user.title}>
                  <SelectItem value="Mr." text="Mr." />
                  <SelectItem value="Ms." text="Ms." />
                  <SelectItem value="Mrs." text="Mrs." />
                  <SelectItem value="Miss" text="Miss" />
                  <SelectItem value="Dr." text="Dr." />
                </Select>
              </div>
              <div class="sm:col-span-2">
                <TextInput name="first_name" labelText="First Name" bind:value={user.first_name} required />
              </div>
              <div class="sm:col-span-2">
                <TextInput name="last_name" labelText="Last Name" bind:value={user.last_name} required />
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-5 gap-4">
              <div class="sm:col-span-3">
                <TextInput name="email" labelText="Email" type="email" bind:value={user.email} required />
              </div>
              <div class="sm:col-span-2">
                <TextInput name="phone" labelText="Phone" bind:value={user.phone} />
              </div>
            </div>
            <div class="grid grid-cols-1 gap-2">
              <div>
                <TextInput name="address_1" labelText="Street Address" bind:value={user.address_1} />
              </div>
              <!-- <div>
                <TextInput name="address_2" bind:value={user.address_2} />
              </div> -->
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <TextInput name="postcode" labelText="Postcode" bind:value={user.postcode} />
              </div>
              <div>
                <TextInput name="city" labelText="City" bind:value={user.city} />
              </div>
              <div>
                <TextInput name="state" labelText="State" bind:value={user.state} />
              </div>
              <div>
                <Select labelText="Country" name="country" bind:selected={user.country} required>
                  {#each data.options[4].options as country}
                    <SelectItem value={country.name} />
                  {/each}
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded mb-4">
          <div class="px-4 py-2 border-b border-gray-200">
            <h2 class="h2">Driver and Passenger Details</h2>
          </div>
          <div class="p-5 grid grid-cols-1 gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Select
                    labelText="Driver's License"
                    name="license"
                    bind:selected={quote.details.driver.license}
                    required
                  >
                    <SelectItem value="" text="Select license" />
                    {#each data.options[3].options as license}
                      <SelectItem value={license.name} />
                    {/each}
                  </Select>
                </div>
                <div>
                  <TextInput
                    labelText="Driver's Age"
                    name="age"
                    type="number"
                    bind:value={quote.details.driver.age}
                    required
                  />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <NumberInput
                    name="adult"
                    label="Number of Adult"
                    bind:value={quote.details.passenger.adult}
                    allowEmpty
                    required
                  />
                </div>
                <div>
                  <NumberInput
                    name="children"
                    label="Number of Children"
                    bind:value={quote.details.passenger.children}
                    allowEmpty
                    required
                  />
                </div>
              </div>
            </div>
            <div>
              <TextArea name="comment" labelText="Your travel comment" bind:value={quote.comment} />
            </div>
          </div>
        </div>
        <div class="bg-white rounded mb-4">
          <div class="p-5 grid grid-cols-1 gap-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <TextInput labelText="Promo Code" name="code_promo" bind:value={quote.code_promo} />
              </div>
              <div>
                <TextInput labelText="Affiliate Code" name="code_affiliate" bind:value={quote.code_affiliate} />
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <p class="mb-4">
            Please click the below <b>Submit Quote Request</b> button to get an instant quote to your email
          </p>
          <Button type="submit" class="px-10">Submit Quote Request</Button>
          <input type="hidden" name="user" value={JSON.stringify(user)} />
          <input type="hidden" name="quote" value={JSON.stringify(quote)} />
        </div>
      </form>
    </div>
  </div>
{/if}
