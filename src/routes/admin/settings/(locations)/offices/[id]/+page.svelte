<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "General",
    groups: [
      {
        name: "Info",
        description: "",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          }
        ],
      },
      {
        name: "Company",
        description: "Leave blank to use default",
        fields: [
          {
            name: "company_name",
            label: "Company Name",
            type: "text",
          },
          {
            name: "company_number",
            label: "Company Number",
            type: "text",
          },
          {
            name: "company_number_old",
            label: "Company Number (Old)",
            type: "text",
          },
        ],
      },
      {
        name: "Contact",
        description: "",
        fields: [
          {
            name: "phone",
            label: "Phone",
            type: "text",
          },
          {
            name: "email",
            label: "Email",
            type: "text",
          },
        ],
      },
      {
        name: "Address",
        description: "",
        fields: [
          {
            name: "address_1",
            label: "Address 1",
            type: "text",
          },
          {
            name: "address_2",
            label: "Address 2",
            type: "text",
          },
          {
            name: "postcode",
            label: "Postcode",
            type: "text",
          },
          {
            name: "city",
            label: "City",
            type: "text",
          },
          {
            name: "state",
            label: "State",
            type: "text",
          },
          {
            name: "country",
            label: "Country",
            type: "related",
            related: "countries",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Office" />
<Form {form} table="offices" />
