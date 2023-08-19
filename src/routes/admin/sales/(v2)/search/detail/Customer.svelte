<script>
  import dayjs from "dayjs";
  import { supabase } from "$lib/supabaseClient";
  import { Button, Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";
  import { onMount } from "svelte";
  export let title = "Customer Information";
  export let quote;
  export let options;

  let noCustomer = false;
  const defaultUser = {
      id: null,
      title: null,
      first_name: null,
      last_name: null,
      phone: null,
      email: null,
      address_1: null,
      address_2: null,
      postcode: null,
      city: null,
      state: null,
      country: null,
    };
  const lookupCustomer = async () => {
    noCustomer = false;
    const { data: dataCustomer, error: errorData } = await supabase
      .from("users")
      .select()
      // .or(`email.eq.${searchCustomer},last_name.eq.${searchCustomer}`)
      .eq("email", quote.users.email.trim())
      .single();

    // console.log(dataCustomer);
    if (dataCustomer) {
      // console.log("YES");
      // user = dataCustomer;
      quote.users = dataCustomer;
    } else {
      // console.log("NO");
      quote.users.id = "add";
      // quote.users.email = searchCustomer
    }
  };
  const changeCustomer = () => {
    noCustomer = false;
    quote.users = {...defaultUser};
  };
  const addCustomer = async () => {
    noCustomer = false;
    delete quote.users.id;
    const { data: dataCustomer, error: errorData } = await supabase.from("users").insert(quote.users).select().single();

    if (dataCustomer) {
      quote.users = dataCustomer;
    } else {
      quote.users = {...defaultUser};
    }
  };
</script>

<div class="bg-white rounded mb-4">
  <div class="p-5 border-b border-gray-200">
    <h2 class="h2">{title}</h2>
  </div>
  <div class="p-5 grid grid-cols-1 gap-5">
    {#if !quote.users.id}
      <div class="flex items-end">
        <div class="flex-1">
          <TextInput labelText="Customer Email" bind:value={quote.users.email} />
        </div>
        <Button on:click={lookupCustomer}>Search</Button>
      </div>
    {:else if quote.users.id === "add"}
      <div class="grid grid-cols-1 gap-5">
        <div class="grid grid-cols-1 sm:grid-cols-5 gap-5">
          <div>
            <Select name="title" labelText="Title" value={quote.users.title} required>
              <SelectItem value="Mr." text="Mr." />
              <SelectItem value="Ms." text="Ms." />
              <SelectItem value="Mrs." text="Mrs." />
              <SelectItem value="Miss" text="Miss" />
              <SelectItem value="Dr." text="Dr." />
            </Select>
          </div>
          <div class="col-span-2">
            <TextInput name="first_name" labelText="First Name" bind:value={quote.users.first_name} required />
          </div>
          <div class="col-span-2">
            <TextInput name="last_name" labelText="Last Name" bind:value={quote.users.last_name} required />
          </div>
        </div>
        <div>
          <TextInput name="email" labelText="Email" type="email" bind:value={quote.users.email} required />
        </div>
        <div>
          <TextInput name="phone" labelText="Phone" bind:value={quote.users.phone} required />
        </div>
        <div class="font-bold text-lg pt-10">Home Address</div>
        <div>
          <TextInput name="address_1" labelText="Address 1" bind:value={quote.users.address_1} required />
        </div>
        <div>
          <TextInput name="address_2" labelText="Address 2" bind:value={quote.users.address_2} required />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <TextInput name="postcode" labelText="Postcode" bind:value={quote.users.postcode} required />
          </div>
          <div>
            <TextInput name="city" labelText="City" bind:value={quote.users.city} required />
          </div>
          <div>
            <TextInput name="state" labelText="State" bind:value={quote.users.state} required />
          </div>
          <div>
            <Select labelText="Country" name="country" bind:value={quote.users.country}>
              {#each options[4].options as country}
                <SelectItem value={country.name} />
              {/each}
            </Select>
          </div>
        </div>
        <div>
          <Button on:click={addCustomer}>Add Customer</Button>
          <Button
            kind="ghost"
            on:click={() => {
              quote.users.id = null;
            }}>Cancel</Button
          >
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <div class="text-sm text-gray-400">Name</div>
          <div class="mb-5">{quote.users.first_name} {quote.users.last_name}</div>
          <div class="text-sm text-gray-400">Contact</div>
          <div class="mb-5">
            {quote.users.email}<br />
            {quote.users.phone || ""}
          </div>
        </div>
        <div>
          <div class="text-sm text-gray-400">Address</div>
          <div class="mb-5">
            {@html quote.users.address_1 ? `${quote.users.address_1},<br>` : ""}
            {@html quote.users.address_2 ? `${quote.users.address_2},<br>` : ""}
            {@html quote.users.postcode ? `${quote.users.postcode}` : ""}
            {@html quote.users.city ? `${quote.users.city},<br>` : ""}
            {@html quote.users.state ? `${quote.users.state}` : ""}
            {@html quote.users.country ? `${quote.users.country}` : ""}
          </div>
        </div>
      </div>
      <div>
        <Button on:click={changeCustomer}>Change Customer</Button>
      </div>
    {/if}
  </div>
</div>
