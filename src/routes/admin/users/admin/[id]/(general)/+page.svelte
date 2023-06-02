<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  import { Select, SelectItem } from "carbon-components-svelte";
  export let data;
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
</script>

<PageTitle title="User" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.type, data.id)} />
<Form id={data.id} path={data.path}>
  <FormSection title="Personal">
    <InputSelect
      name="title"
      label="Title"
      bind:value={data.data.title}
      options={[
        { id: "Mr.", name: "Mr." },
        { id: "Ms.", name: "Ms." },
        { id: "Mrs.", name: "Mrs." },
        { id: "Miss", name: "Miss" },
        { id: "Dr.", name: "Dr." },
      ]}
      half={true}
    />
    <InputText
      name="first_name"
      label="First Name"
      bind:value={data.data.first_name}
      required={true}
    />
    <InputText
      name="last_name"
      label="Last Name"
      bind:value={data.data.last_name}
      required={true}
    />
    <InputSelect
      name="role"
      label="Role"
      bind:value={data.data.role}
      options={[
        { id: "quoted", name: "Quoted" },
        { id: "booked", name: "Booked" },
        { id: "enquiry", name: "Enquiry" },
        { id: "subscribed", name: "Subscribed" },
        { id: "affiliate", name: "Affiliate" },
        { id: "supplier", name: "Supplier" },
        { id: "admin", name: "Admin" },
      ]}
      half={true}
    />
  </FormSection>
  <FormSection title="Contacts">
    <InputText name="email" label="Email" bind:value={data.data.email} required={true} />
    <InputText name="phone" label="Phone" bind:value={data.data.phone} />
  </FormSection>
  <FormSection title="Address">
    <InputText
      name="address_1"
      label="Line 1"
      bind:value={data.data.address_1}
    />
    <InputText
      name="address_2"
      label="Line 2"
      bind:value={data.data.address_2}
    />
    <InputText
      name="postcode"
      label="Post code"
      bind:value={data.data.postcode}
      half={true}
    />
    <InputText
      name="city"
      label="City"
      bind:value={data.data.city}
      half={true}
    />
    <InputText
      name="state"
      label="State"
      bind:value={data.data.state}
      half={true}
    />
    <div>
      <Select labelText="Country" bind:selected={data.data.country}>
        <SelectItem value="" text="Select country" />
        {#each countries as c}
          <SelectItem value={c} text={c} />
        {/each}
      </Select>
    </div>
    <!-- <InputText
      name="country"
      label="Country"
      bind:value={data.data.country}
      half={true}
    /> -->
  </FormSection>
  <FormSection title="Opt-in">
    <InputToggle
      name="tnc"
      label="Terms and Conditions"
      bind:value={data.data.tnc}
      half={true}
    />
    <InputToggle
      name="newsletter"
      label="Newsletter"
      bind:value={data.data.newsletter}
      half={true}
    />
  </FormSection>
</Form>
