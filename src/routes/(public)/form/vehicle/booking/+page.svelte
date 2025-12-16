<script>
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Select,
    SelectItem,
    TextInput,
    TextArea,
    NumberInput,
    Checkbox,
  } from "carbon-components-svelte";
  import InputDateRange2 from "$lib/components/admin/InputDateRange2.svelte";
  import dayjs from "dayjs";
  import Honeypot from "../../honeypot.svelte";

  export let data;
  // console.log(data);
  let selected_category = "";
  let selected_vehicle = "";
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
  const thisYear = new Date().getFullYear();
  const pad = (num) => {
    var s = "0" + num;
    return s.slice(-2);
  };
</script>

<form method="POST">
  <div class="bg-white container xl:max-w-7xl my-8 mx-auto">
    <div class="p-5 border-b border-gray-200">
      <h1 class="text-2xl font-bold">Vehicle Booking Request</h1>
      <div>This is a secure SSL booking form</div>
    </div>
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
              <TextInput labelText="Quote No." name="reference" required />
            </div>
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
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
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
              <Select
                labelText="Name of Vehicle"
                name="vehicles"
                required
                on:change={(e) => {
                  selected_vehicle = e.target.value;
                }}
              >
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
            <div>
              <Select labelText="Bonds" name="bonds" required>
                <SelectItem value="" text="Select a bond" />
                {#each data.bonds as bond}
                  <SelectItem
                    value={bond.id}
                    text={bond.name}
                    class={getIdArray(bond.vehicles).includes(selected_vehicle) ? "block" : "hidden"}
                  />
                {/each}
              </Select>
            </div>
            <div>
              <TextArea labelText="Comments" name="comments" />
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
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Travel Information</h3>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md grid grid-cols-1 gap-6">
          <div class="flex-1 grid grid-cols-2">
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
          </div>
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
    </section>
    <section class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200">
      <div>
        <h3 class="font-bold mb-4">Payment Information</h3>
        <div class="text-gray-400">
          <div class="font-bold">IMPORTANT:</div>
          <ul class="list-disc pl-4">
            <li>
              Suppliers / operators may require a deposit or full payment - please refer to your quote for details.
            </li>
            <li>Please note your credit card statement will show billing as Australia 4 Wheel Drive Rentals.</li>
          </ul>
        </div>
      </div>
      <div class="md:col-span-2">
        <div class="max-w-md">
          <div class="flex-1 grid grid-cols-1 gap-6">
            <div>
              <Select labelText="Payment Arrangements" name="pay_arrangement">
                <SelectItem value="" text="Select a payment arrangements" />
                <SelectItem
                  value="A - Deposit to agent at booking, balance to supplier at pickup as per quote"
                  text="A - Deposit to agent at booking, balance to supplier at pickup as per quote"
                />
                <SelectItem
                  value="B - Full Payment at time of booking - Booking deposit to agent and balance to supplier as per quote"
                  text="B - Full Payment at time of booking - Booking deposit to agent and balance to supplier as per quote"
                />
                <SelectItem
                  value="C - 20% booking deposit or as nominated to agent, balance 35 days prior to pickup or as nominated date on your quote"
                  text="C - 20% booking deposit or as nominated to agent, balance 35 days prior to pickup or as nominated date on your quote"
                />
              </Select>
            </div>
            <div>
              <NumberInput label="Amount to Pay" step={0.01} name="pay_amount" required />
            </div>
            <div>
              <Select labelText="Card Type" name="card_type" required>
                <SelectItem value="" text="Select a card type" />
                <SelectItem value="MasterCard" text="MasterCard" />
                <SelectItem value="Visa" text="Visa" />
              </Select>
            </div>
            <div>
              <TextInput labelText="Name on Card" name="card_name" required />
            </div>
            <div>
              <TextInput
                labelText="Credit Card No."
                name="card_number"
                title="MasterCard and Visa number"
                pattern={`^[0-9]{16}$`}
                required
              />
            </div>
            <div>
              <div class="font-bold text-sm tracking-wide">Card Expiry</div>
              <div class="grid grid-cols-2">
                <Select labelText="" helperText="Month" name="card_month" required>
                  <SelectItem value="" text="Select a month" />
                  {#each Array(12) as _, mo}
                    <SelectItem value={mo + 1} text={pad(mo + 1)} />
                  {/each}
                </Select>
                <Select labelText="" helperText="Year" name="card_year" required>
                  <SelectItem value="" text="Select a year" />
                  {#each Array(20) as _, yr}
                    <SelectItem value={thisYear + yr} text={thisYear + yr} />
                  {/each}
                </Select>
              </div>
            </div>
            <div>
              <TextInput
                labelText="Security Code (CVV)"
                helperText="Last 3 numbers on back of credit card - VISA and MasterCard only."
                name="card_code"
                pattern={`^[0-9]{3,4}$`}
                title="Last 3 numbers on back of credit card - VISA and MasterCard only."
                required
              />
            </div>
            <div>
              <TextArea
                labelText="Comments"
                helperText="Please enter any additional information you wish us to know about."
                name="card_comments"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="px-5 py-8 border-b border-gray-200">
      <ol class="list-decimal pl-5">
        <li>By completing and submitting this form I hereby acknowledge that I agree to a booking.</li>
        <li>I agree to abide by the terms and conditions of this booking.</li>
        <li>I agree to a deposit or full payment, as quoted, being taken from the credit card specified above.</li>
        <li>
          If you prefer to make payment via online / Internet banking please send us an email and we'll provide our
          banking details.
        </li>
        <li>
          I have read, understood and agreed to the cancellation policy, terms and agreement of Australia 4 Wheel Drive
          Rentals and their suppliers. Click here to view our <a href="/conditions-australia-4-wheel-drive-rentals"
            >Terms and Agreement</a
          >
        </li>
      </ol>
      <Honeypot />
    </section>
    <footer class="p-5 border-t border-gray-200">
      <div class="mb-4">
        <Checkbox
          name="user_agree"
          labelText="I fully understand and accept the terms, conditions of the supplier of the rental vehicle and booking agent by Australia 4 Wheel Drive Rentals and the payment."
          required
        />
      </div>
      <Button type="submit">Submit booking request now</Button>

      <input type="hidden" name="guests" value={JSON.stringify(guests)} />
      <input type="hidden" name="type" value="bookings" />
    </footer>
  </div>
</form>
