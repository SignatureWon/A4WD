<script>
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Select,
    SelectItem,
    TextInput,
    TextArea,
  } from "carbon-components-svelte";
  import InputDateRange2 from "$lib/components/admin/InputDateRange2.svelte";
  import dayjs from "dayjs";
  import Honeypot from "../../../honeypot.svelte";

  export let data;
  //   console.log(data);
  let selected_category = "";
  const getIdArray = (arr) => {
    let res = [];
    arr.forEach((a) => {
      res.push(a.id);
    });
    return res;
  };
  let guests = [];
  let count_adults = 0;
  let count_children = 0;
  const genGuests = () => {
    // console.log("count_adults", count_adults);
    // console.log("count_children", count_children);
    let adults = [];
    let children = [];

    for (let index = 0; index < count_adults; index++) {
      adults.push({
        type: "adults",
        title: "Mr",
        name: "",
        age: 25,
      });
    }
    for (let index = 0; index < count_children; index++) {
      children.push({
        type: "children",
        title: "Master",
        name: "",
        age: 7,
      });
    }
    let adults_index = 0;
    let children_index = 0;
    guests.forEach((guest) => {
      if (guest.type === "adults") {
        if (adults_index < count_adults) {
          adults[adults_index] = guest;
          adults_index++;
        }
      } else {
        if (children_index < count_children) {
          children[children_index] = guest;
          children_index++;
        }
      }
    });
    // console.log([...adults, ...children]);
    return [...adults, ...children];
  };
</script>

<form method="POST">
  <div class="bg-white container xl:max-w-7xl my-8 mx-auto">
    <h1 class="text-2xl font-bold p-5 border-b border-gray-200">Tour Quotation Request</h1>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Customer Information</h3>
        <p class="text-gray-400">
          IMPORTANT: To help us serve you even better please specify the means and date of your arrival at the pickup
          point and your time flexibility. This information will assist us in preparing a more accurate quote for your
          benefit.
        </p>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <Select labelText="Title" name="title">
                <SelectItem value="" text="Select title" />
                <SelectItem value="Mr" text="Mr" />
                <SelectItem value="Mrs" text="Mrs" />
                <SelectItem value="Ms" text="Ms" />
                <SelectItem value="Miss" text="Miss" />
                <SelectItem value="Dr" text="Dr" />
              </Select>
            </div>
            <div>
              <TextInput
                labelText="Given Names"
                name="first_name"
                helperText="Please state your first and middle names (e.g. Christian name)"
                required
              />
            </div>
            <div>
              <TextInput
                labelText="Last Name"
                name="last_name"
                helperText="Please state your last name (e.g. family or surname)"
                required
              />
            </div>
            <div>
              <TextInput labelText="Street" name="address_1" class="mb-2" />
              <TextInput labelText="" name="address_2" />
            </div>
            <div>
              <TextInput labelText="City / Suburb" name="city" />
            </div>
            <div>
              <TextInput labelText="State / Province" name="state" />
            </div>
            <div>
              <TextInput labelText="Postcode" name="postcode" />
            </div>
            <div>
              <Select labelText="Country" name="country">
                <SelectItem value="" text="Select country" />
                {#each data.options.countries as country}
                  <SelectItem value={country.name} text={country.name} />
                {/each}
              </Select>
            </div>
            <div>
              <TextInput
                labelText="Phone / Mobile"
                type="tel"
                name="phone"
                helperText="Include country and area code (only numbers allowed)"
              />
            </div>
            <div>
              <TextInput labelText="Email" type="email" name="email" required />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Vehicle Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <Select
                labelText="Vehicle Category"
                name="categories"
                on:change={(e) => {
                  selected_category = e.target.value;
                }}
              >
                <SelectItem value="" text="Select a category" />
                {#each data.options.categories as category}
                  <SelectItem value={category.id} text={category.name} />
                {/each}
              </Select>
            </div>
            <div>
              <Select labelText="Name of Vehicle" name="vehicles" required>
                <SelectItem value="" text="Select a vehicle" />
                {#each data.vehicles as vehicle}
                  <SelectItem
                    value={vehicle.id}
                    text={vehicle.name}
                    class={getIdArray(vehicle.categories).includes(selected_category) ? "block" : "hidden"}
                  />
                {/each}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Bond Reduced</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <Select
                labelText="Bond"
                name="bond"
              >
                <SelectItem value="" text="Select a bond" />
                <SelectItem value="Standard" text="Standard" />
                <SelectItem value="Bond Reduced" text="Bond Reduced" />
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Driver Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <Select labelText="Driver's License" name="licenses" required>
                <SelectItem value="" text="Select license" />
                {#each data.options.licenses as license}
                  <SelectItem value={license.id} text={license.name} />
                {/each}
              </Select>
            </div>
            <div>
              <TextInput labelText="Driver's Age" name="age" required />
            </div>
          </div>
        </div>
      </div>
    </section> -->
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Travel Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md grid grid-cols-1 gap-6">
          <!-- <div class="flex-1 grid grid-cols-2">
            <div>
              <Select labelText="Pick-up" name="pickup_depot" required>
                <SelectItem value="" text="Select pick-up location" />
                {#each data.options.depots as depot}
                  <SelectItem value={depot.id} text={depot.name} />
                {/each}
              </Select>
            </div>
            <div>
              <Select labelText="Drop-off" name="dropoff_depot" required>
                <SelectItem value="" text="Select drop-off location" />
                {#each data.options.depots as depot}
                  <SelectItem value={depot.id} text={depot.name} />
                {/each}
              </Select>
            </div>
          </div> -->
          <div>
            <InputDateRange2
              nameFrom="pickup_date"
              nameTo="dropoff_date"
              labelFrom="Start Date"
              labelTo="End Date"
              valueFrom={dayjs().format("DD/MM/YYYY")}
              valueTo={dayjs().add(7, "day").format("DD/MM/YYYY")}
              required={true}
            />
          </div>
          <div class="flex-1 grid grid-cols-2">
            <div>
              <Select
                labelText="Adults"
                bind:selected={count_adults}
                name="count_adults"
                on:change={(e) => {
                  guests = genGuests();
                }}
              >
                {#each Array(11) as _, no}
                  <SelectItem value={no} text={no} />
                {/each}
              </Select>
            </div>
            <div>
              <Select
                labelText="Children (8 and under)"
                bind:selected={count_children}
                name="count_children"
                on:change={(e) => {
                  guests = genGuests();
                }}
              >
                {#each Array(11) as _, no}
                  <SelectItem value={no} text={no} />
                {/each}
              </Select>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Arrival Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <Select labelText="Means of Travel" name="arrival_by">
                <SelectItem value="Not specified" text="Not specified" />
                <SelectItem value="Arriving by air" text="Arriving by air" />
                <SelectItem value="Arriving by bus" text="Arriving by bus" />
                <SelectItem value="Arriving by rail / train" text="Arriving by rail / train" />
                <SelectItem value="Driving" text="Driving" />
              </Select>
            </div>
            <div>
              <Select labelText="Flexibility" name="flexibility">
                <SelectItem value="Not flexible" text="Not flexible" />
                <SelectItem value="1 day" text="1 day" />
                <SelectItem value="2 days" text="2 days" />
                <SelectItem value="3 days" text="3 days" />
                <SelectItem value="4 - 6 days" text="4 - 6 days" />
                <SelectItem value="1 week or more" text="1 week or more" />
              </Select>
            </div>
            <div>
              <DatePicker dateFormat="d/m/Y" datePickerType="single" name="arrival_date">
                <DatePickerInput labelText="Arrival Date" name="arrival_date" />
              </DatePicker>
            </div>
            <div>
              <TextArea
                labelText="Flight Arrival Details"
                name="arrival_flight"
                helperText="Please indicate your flight number and arrival time if you are hiring a car"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Tour Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <TextArea labelText="Tell us what tour or tour code you wish" name="tour_code" />
            </div>
            <div>
              <TextArea
                labelText="Tell us what accommodation or accommodation code you wish"
                name="accommodation_code"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Passenger Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            {#if guests.length === 0}
              <div class="bg-gray-100 px-5 py-10">
                Please select the number of adults and children in Travel Information above
              </div>
            {/if}
            {#each guests as guest, index}
              <div>
                <div class="font-bold text-sm tracking-wide">
                  {index + 1}.
                  {guest.type === "adults" ? "Adult" : "Children"}
                </div>
                <div class="flex items-end">
                  <Select labelText="" bind:selected={guest.title}>
                    {#if guest.type === "adults"}
                      <SelectItem value="Mr" text="Mr" />
                      <SelectItem value="Mrs" text="Mrs" />
                      <SelectItem value="Ms" text="Ms" />
                      <SelectItem value="Dr" text="Dr" />
                    {:else}
                      <SelectItem value="Master" text="Master" />
                      <SelectItem value="Miss" text="Miss" />
                    {/if}
                  </Select>
                  <TextInput labelText="" placeholder="Name" bind:value={guest.name} class="flex-1" />
                  <Select labelText="" bind:selected={guest.age}>
                    {#if guest.type === "adults"}
                      {#each Array(75) as _, i}
                        {#if i > 12}
                          <SelectItem value={i} text={i} />
                        {/if}
                      {/each}
                      <SelectItem value="75+" text="75+" />
                    {:else}
                      <SelectItem value="0" text="Infant" />
                      {#each Array(12) as _, i}
                        <SelectItem value={i + 1} text={i + 1} />
                      {/each}
                    {/if}
                  </Select>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>
      <Honeypot />
    </section>
    <footer class="p-5 border-t border-gray-200">
      <input type="hidden" name="guests" value={JSON.stringify(guests)} />
      <input type="hidden" name="type" value="quotations" />
      <Button type="submit">Submit</Button>
    </footer>
  </div>
</form>
