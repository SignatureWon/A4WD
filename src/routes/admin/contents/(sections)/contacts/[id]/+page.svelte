<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Contact",
    groups: [
      {
        name: "Info",
        description: "",
        fields: [
          {
            name: "name",
            label: "Type",
            type: "select",
            options: [
              {
                id: "Phone",
                name: "Phone",
              },
              {
                id: "Email",
                name: "Email",
              },
              {
                id: "Address",
                name: "Address",
              },
              {
                id: "Facebook",
                name: "Facebook",
              },
              {
                id: "LinkedIn",
                name: "LinkedIn",
              },
              {
                id: "Instagram",
                name: "Instagram",
              },
              {
                id: "Twitter",
                name: "Twitter",
              },
              {
                id: "YouTube",
                name: "YouTube",
              },
            ],
            required: true,
          },
          {
            name: "content",
            label: "Value",
            type: "text",
          },
          {
            name: "description",
            label: "Description",
            type: "text",
          },
          {
            name: "type",
            type: "hidden",
            default: "contacts",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Contact" table="contents" />
<Form {form} table="contents" />
