<script>
  import { supabase } from "$lib/supabaseClient";
  import { db } from "$lib/db";
  import { onMount } from "svelte";
  import {
    DatePicker,
    Select,
    SelectItem,
    TextInput,
    TextArea,
    DatePickerInput,
    Button,
  } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import DateRange from "../../../../../../lib/admin/input/DateRange.svelte";
  dayjs.extend(customParseFormat);

  const countries = [
    "Afghanistan",
    "Åland Islands",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Cayman Islands",
    "Central African Republic",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands",
    "Colombia",
    "Comoros",
    "Congo",
    "Congo",
    "Cook Islands",
    "Costa Rica",
    "Cote D'ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Falkland Islands",
    "Faroe Islands",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-bissau",
    "Guyana",
    "Haiti",
    "Heard Island and Mcdonald Islands",
    "Holy See (Vatican City State)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libyan Arab Jamahiriya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands",
    "Netherlands Antilles",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "North Korea",
    "Northern Mariana Islands",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestinian Territory",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Reunion",
    "Romania",
    "Russian Federation",
    "Rwanda",
    "Saint Helena",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Pierre and Miquelon",
    "Saint Vincent and The Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan, Province of China",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States",
    "United States Minor Outlying Islands",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Virgin Islands, British",
    "Virgin Islands, U.S.",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
  ];

  let record = {
    reference: "",
    title: "Mr",
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "Australia",
    phone: "",
    email: "",
    arrival_by: "",
    flexibility: "",
    arrival_date: null,
    arrival_flight: "",
    categories: "",
    vehicles: "",
    licenses: "",
    ages: "",
    pickup_depot: "",
    dropoff_depot: "",
    pickup_date: null,
    dropoff_date: null,
    count_adults: 0,
    count_children: 0,
    guests: [],
    type: "quotations",
  };

  const dateKey = ["arrival_date", "pickup_date", "dropoff_date"];

  const foreignKey = [
    "suppliers",
    "categories",
    "vehicles",
    "licenses",
    "pickup_depot",
    "dropoff_depot",
    "bonds",
    "ages",
  ];

  let submitted = false;

  let searchOptions = "type";
  let suppliers = [];
  let categories = [];
  let vehicles = [];
  let constants = [];
  let depots = [];

  const getIdArray = (arr) => {
    let res = [];
    arr.forEach((a) => {
      res.push(a.id);
    });

    return res;
  };

  const getSupplierId = (obj = {}) => {
    let res = "";
    if (obj) {
      if ("id" in obj) {
        res = obj.id;
      }
    }
    return res;
  };

  const genGuests = () => {
    let adults = [];
    let children = [];

    for (let index = 0; index < record.count_adults; index++) {
      adults.push({
        type: "adults",
        title: "Mr",
        name: "",
        age: 25,
      });
    }
    for (let index = 0; index < record.count_children; index++) {
      children.push({
        type: "children",
        title: "Master",
        name: "",
        age: 7,
      });
    }
    let adults_index = 0;
    let children_index = 0;
    record.guests.forEach((guest) => {
      if (guest.type === "adults") {
        if (adults_index < record.count_adults) {
          adults[adults_index] = guest;
          adults_index++;
        }
      } else {
        if (children_index < record.count_children) {
          children[children_index] = guest;
          children_index++;
        }
      }
    });
    return [...adults, ...children];
  };

  const addRecord = async () => {
    const { data: checkUser } = await supabase
      .from("profiles")
      .select()
      .eq("email", record.email)
      .single();

    if (!checkUser) {
      const { data: newUser, error: errUser } = await supabase.auth.signUp({
        email: record.email,
        password: "password",
      });
    }

    let newRecord = {};
    for (const key in record) {
      if (dateKey.includes(key)) {
        if (record[key]) {
          newRecord[key] = dayjs(record[key], "DD/MM/YYYY").format(
            "MM/DD/YYYY"
          );
        }
      } else if (foreignKey.includes(key)) {
        if (record[key]) {
          newRecord[key] = record[key];
        }
      } else {
        newRecord[key] = record[key];
      }
    }

    const { data: newQuote, error: errQuote } = await supabase
      .from("forms")
      .insert([newRecord])
      .select()
      .single();

    if (errQuote) {
      console.log(errQuote);
    } else {
      submitted = true;
    }
  };

  onMount(async () => {
    const { data: getSuppliers } = await supabase
      .from("suppliers")
      .select("id, name")
      .eq("status", true)
      .order("rank", {
        ascend: true,
      });
    suppliers = getSuppliers;

    const { data: getCategories } = await supabase
      .from("categories")
      .select("id, name")
      .eq("type", "vehicles")
      .eq("status", true)
      .order("rank", {
        ascend: true,
      });
    categories = getCategories;

    const { data: getVehicles } = await supabase
      .from("vehicles")
      .select("id, name, categories (id), suppliers (id)")
      .eq("status", true)
      .order("rank", {
        ascend: true,
      });
    vehicles = getVehicles;

    const { data: getConstants } = await supabase
      .from("constants")
      .select("id, name, type")
      .eq("status", true)
      .in("type", ["licenses", "ages"])
      .order("rank", {
        ascend: true,
      });
    constants = getConstants;

    const { data: getDepots } = await supabase
      .from("depots")
      .select("id, name")
      .order("name", {
        ascend: true,
      });
    depots = getDepots;
  });
</script>

{#if submitted}
  <div
    class="bg-white container xl:max-w-7xl my-8 mx-auto px-5 py-10 text-center"
  >
    <div
      class="text-green-600 bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-5"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-10 h-10"
        fill="currentColor"
        ><path
          d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"
        /></svg
      >
    </div>
    <div class="text-gray-500 mb-2">Request submitted!</div>
    <div class="text-2xl font-bold mb-10">We'll get back to you soon</div>
    <div>
      <a href="/" class="text-brand-600 hover:text-brand-800">Back to home</a>
    </div>
  </div>
{:else}
  <form
    on:submit={() => {
      addRecord();
    }}
  >
    <div class="bg-white container xl:max-w-7xl my-8 mx-auto">
      <h1 class="text-2xl font-bold p-5 border-b border-gray-200">
        Vehicle Quotation Request
      </h1>
      <section
        class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200"
      >
        <div>
          <h3 class="font-bold mb-4">Customer Information</h3>
          <p class="text-gray-400">
            IMPORTANT: To help us serve you even better please specify the means
            and date of your arrival at the pickup point and your time
            flexibility. This information will assist us in preparing a more
            accurate quote for your benefit.
          </p>
        </div>
        <div class="md:col-span-2">
          <div class="max-w-md">
            <div class="flex-1 grid grid-cols-1 gap-6">
              <!-- <div>
                <TextInput
                  labelText="Quote No."
                  bind:value={record.reference}
                />
              </div> -->
              <div>
                <Select labelText="Title" bind:selected={record.title}>
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
                  bind:value={record.first_name}
                  helperText="Please state your first and middle names (e.g. Christian name)"
                />
              </div>
              <div>
                <TextInput
                  labelText="Last Name"
                  bind:value={record.last_name}
                  helperText="Please state your last name (e.g. family or surname)"
                />
              </div>
              <div>
                <TextInput
                  labelText="Street"
                  bind:value={record.address_1}
                  class="mb-2"
                />
                <TextInput labelText="" bind:value={record.address_2} />
              </div>
              <div>
                <TextInput labelText="City / Suburb" bind:value={record.city} />
              </div>
              <div>
                <TextInput
                  labelText="State / Province"
                  bind:value={record.state}
                />
              </div>
              <div>
                <TextInput labelText="Postcode" bind:value={record.postcode} />
              </div>
              <div>
                <Select labelText="Country" bind:selected={record.country}>
                  <SelectItem value="" text="Select country" />
                  {#each countries as c}
                    <SelectItem value={c} text={c} />
                  {/each}
                </Select>
              </div>
              <div>
                <TextInput
                  labelText="Phone / Mobile"
                  type="tel"
                  bind:value={record.phone}
                  helperText="Include country and area code (only numbers allowed)"
                />
              </div>
              <div>
                <TextInput
                  labelText="Email"
                  type="email"
                  bind:value={record.email}
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200"
      >
        <div>
          <h3 class="font-bold mb-4">Vehicle Information</h3>
        </div>
        <div class="md:col-span-2">
          <div class="max-w-md">
            <div class="flex-1 grid grid-cols-1 gap-6">
              <!-- <div>
                <Select
                  labelText="Search Options"
                  bind:selected={searchOptions}
                >
                  <SelectItem value="type" text="Choose vehicle by type" />
                  <SelectItem
                    value="supplier"
                    text="Choose vehicle by supplier"
                  />
                </Select>
              </div> -->
              <!-- {#if searchOptions === "type"} -->
              <div>
                <Select
                  labelText="Vehicle Category"
                  bind:selected={record.categories}
                >
                  <SelectItem value="" text="Select a category" />
                  {#each categories as cat}
                    <SelectItem value={cat.id} text={cat.name} />
                  {/each}
                </Select>
              </div>
              <div>
                <Select
                  labelText="Name of Vehicle"
                  bind:selected={record.vehicles}
                >
                  <SelectItem value="" text="Select a vehicle" />
                  {#each vehicles as veh}
                    <SelectItem
                      value={veh.id}
                      text={veh.name}
                      class={getIdArray(veh.categories).includes(
                        record.categories
                      )
                        ? "block"
                        : "hidden"}
                    />
                  {/each}
                </Select>
              </div>
              <!-- {:else}
                <div>
                  <Select
                    labelText="Vehicle Supplier"
                    bind:selected={record.suppliers}
                  >
                    <SelectItem value="" text="Select a supplier" />
                    {#each suppliers as sup}
                      <SelectItem value={sup.id} text={sup.name} />
                    {/each}
                  </Select>
                </div>
                <div>
                  <Select
                    labelText="Name of Vehicle"
                    bind:selected={record.vehicles}
                  >
                    <SelectItem value="" text="Select a vehicle" />
                    {#each vehicles as veh}
                      <SelectItem
                        value={veh.id}
                        text={veh.name}
                        class={getSupplierId(veh.suppliers) === record.suppliers
                          ? "block"
                          : "hidden"}
                      />
                    {/each}
                  </Select>
                </div>
              {/if} -->
            </div>
          </div>
        </div>
      </section>
      <section
        class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200"
      >
        <div>
          <h3 class="font-bold mb-4">Driver Information</h3>
        </div>
        <div class="md:col-span-2">
          <div class="max-w-md">
            <div class="flex-1 grid grid-cols-1 gap-6">
              <div>
                <Select
                  labelText="Driver's License"
                  bind:selected={record.licenses}
                >
                  <SelectItem value="" text="Select license" />
                  {#each constants as con}
                    {#if con.type === "licenses"}
                      <SelectItem value={con.id} text={con.name} />
                    {/if}
                  {/each}
                </Select>
              </div>
              <div>
                <TextInput labelText="Driver's Age" bind:value={record.ages} />
                <!-- <Select labelText="Driver's Age" bind:selected={record.ages}>
                  <SelectItem value="" text="Select age" />
                  {#each constants as con}
                    {#if con.type === "ages"}
                      <SelectItem value={con.id} text={con.name} />
                    {/if}
                  {/each}
                </Select> -->
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200"
      >
        <div>
          <h3 class="font-bold mb-4">Travel Information</h3>
        </div>
        <div class="md:col-span-2">
          <div class="max-w-md grid grid-cols-1 gap-6">
            <div class="flex-1 grid grid-cols-2">
              <div>
                <Select labelText="Pick-up" bind:selected={record.pickup_depot}>
                  <SelectItem value="" text="Select pick-up location" />
                  {#each depots as dep}
                    <SelectItem value={dep.id} text={dep.name} />
                  {/each}
                </Select>
              </div>
              <div>
                <Select
                  labelText="Drop-off"
                  bind:selected={record.dropoff_depot}
                >
                  <SelectItem value="" text="Select drop-off location" />
                  {#each depots as dep}
                    <SelectItem value={dep.id} text={dep.name} />
                  {/each}
                </Select>
              </div>
            </div>
            <div>
              <DatePicker
                dateFormat="d/m/Y"
                datePickerType="range"
                bind:valueFrom={record.pickup_date}
                bind:valueTo={record.dropoff_date}
              >
                <DatePickerInput
                  labelText="Start date"
                  placeholder="dd/mm/yyyy"
                />
                <DatePickerInput
                  labelText="End date"
                  placeholder="dd/mm/yyyy"
                />
              </DatePicker>
            </div>
            <div class="flex-1 grid grid-cols-2">
              <div>
                <Select
                  labelText="Adults"
                  bind:selected={record.count_adults}
                  on:change={(e) => {
                    record.guests = genGuests();
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
                  bind:selected={record.count_children}
                  on:change={(e) => {
                    record.guests = genGuests();
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
      <section
        class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200"
      >
        <div>
          <h3 class="font-bold mb-4">Arrival Information</h3>
        </div>
        <div class="md:col-span-2">
          <div class="max-w-md">
            <div class="flex-1 grid grid-cols-1 gap-6">
              <div>
                <Select
                  labelText="Means of Travel"
                  bind:selected={record.arrival_by}
                >
                  <SelectItem value="Not specified" text="Not specified" />
                  <SelectItem value="Arriving by air" text="Arriving by air" />
                  <SelectItem value="Arriving by bus" text="Arriving by bus" />
                  <SelectItem
                    value="Arriving by rail / train"
                    text="Arriving by rail / train"
                  />
                  <SelectItem value="Driving" text="Driving" />
                </Select>
              </div>
              <div>
                <Select
                  labelText="Flexibility"
                  bind:selected={record.flexibility}
                >
                  <SelectItem value="Not flexible" text="Not flexible" />
                  <SelectItem value="1 day" text="1 day" />
                  <SelectItem value="2 days" text="2 days" />
                  <SelectItem value="3 days" text="3 days" />
                  <SelectItem value="4 - 6 days" text="4 - 6 days" />
                  <SelectItem value="1 week or more" text="1 week or more" />
                </Select>
              </div>
              <div>
                <DatePicker
                  dateFormat="d/m/Y"
                  datePickerType="single"
                  bind:value={record.arrival_date}
                >
                  <DatePickerInput
                    labelText="Arrival Date"
                    bind:value={record.arrival_date}
                  />
                </DatePicker>
              </div>
              <div>
                <TextArea
                  labelText="Flight Arrival Details"
                  bind:value={record.arrival_flight}
                  helperText="Please indicate your flight number and arrival time if you are hiring a car"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        class="grid md:grid-cols-3 gap-10 p-5 py-8 border-b border-gray-200"
      >
        <div>
          <h3 class="font-bold mb-4">Passenger Information</h3>
        </div>
        <div class="md:col-span-2">
          <div class="max-w-md">
            <div class="flex-1 grid grid-cols-1 gap-6">
              {#if record.guests.length === 0}
                <div class="bg-gray-100 px-5 py-10">
                  Please select the number of adults and children in Travel
                  Information above
                </div>
              {/if}
              {#each record.guests as guest, index}
                <div>
                  <div class="font-bold text-sm tracking-wide">
                    {index + 1}.
                    {guest.type === "adults" ? "Adult" : "Child"}
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
                    <TextInput
                      labelText=""
                      placeholder="Name"
                      bind:value={guest.name}
                      class="flex-1"
                    />
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
      <footer class="p-5 border-t border-gray-200">
        <Button type="submit">Submit</Button>
      </footer>
    </div>
  </form>
{/if}
