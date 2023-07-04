<script>
    import dayjs from "dayjs";
    import { supabase } from "$lib/supabaseClient";
    import { Select, SelectItem, TextArea, TextInput } from "carbon-components-svelte";
    import { onMount } from "svelte";
    export let title = "Customer Information";
    export let options

    console.log(options[4]);

    let user = {

    }
    // export let description = null;
    // export let user;
    // export let quote;
    // let countries = [];
  
    // onMount(async () => {
    //   const { data: countryData, error: countryError } = await supabase
    //     .from("constants")
    //     .select("id, name")
    //     .eq("type", "countries")
    //     .order("rank", { ascending: true });
    //   countries = countryData;
    // });
  </script>
  
  <div class="bg-white rounded mb-4">
    <div class="p-5 border-b border-gray-200">
      <h2 class="h2">{title}</h2>
    </div>
    <div class="p-5 grid grid-cols-1 gap-5">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div>
          <Select labelText="Title" name="title" bind:selected={user.title}>
            <SelectItem value="" text="Select title" />
            <SelectItem value="Mr" text="Mr" />
            <SelectItem value="Mrs" text="Mrs" />
            <SelectItem value="Ms" text="Ms" />
            <SelectItem value="Miss" text="Miss" />
            <SelectItem value="Dr" text="Dr" />
          </Select>
        </div>
        <div class="md:col-span-3">
          <TextInput
            labelText="Given Names"
            name="first_name"
            helperText="Please state your first and middle names (e.g. Christian name)"
            bind:value={user.first_name}
            required
          />
        </div>
      </div>
      <div>
        <TextInput
          labelText="Last Name"
          name="last_name"
          helperText="Please state your last name (e.g. family or surname)"
          bind:value={user.last_name}
          required
        />
      </div>
      <div>
        <TextInput labelText="Email" type="email" name="email" required bind:value={user.email} />
      </div>
      <div>
        <TextInput
          labelText="Phone / Mobile"
          type="tel"
          name="phone"
          helperText="Include country and area code (only numbers allowed)"
          bind:value={user.phone}
        />
      </div>
      <div>
        <TextInput labelText="Street" name="address_1" class="mb-2" bind:value={user.address_1} />
        <TextInput labelText="" name="address_2" bind:value={user.address_2} />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <TextInput labelText="Postcode" name="postcode" bind:value={user.postcode} />
        </div>
        <div>
          <TextInput labelText="City / Suburb" name="city" bind:value={user.city} />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <TextInput labelText="State / Province" name="state" bind:value={user.state} required />
        </div>
        <div>
          <Select labelText="Country" name="country" bind:selected={user.country} required>
            <SelectItem value="" text="Select country" />
            {#each options[4].options as country}
              <SelectItem value={country.name} text={country.name} />
            {/each}
          </Select>
        </div>
      </div>
      <!-- <div>
        <TextArea labelText="Travel Plans & Comments" name="comment" bind:value={quote.comment} />
      </div> -->
    </div>
  </div>
  