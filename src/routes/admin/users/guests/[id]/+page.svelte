<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Profile",
    groups: [
      {
        name: "",
        description: "",
        fields: [
          {
            name: "first_name",
            label: "First Name",
            type: "text",
          },
          {
            name: "last_name",
            label: "Last Name",
            type: "text",
          },
          {
            name: "email",
            label: "Email",
            type: "text",
            required: true,
          },
          {
            name: "phone",
            label: "Phone",
            type: "text",
          },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: [
              {
                id: "Member",
                name: "Member",
              },
              {
                id: "Admin",
                name: "Admin",
              },
              {
                id: "Agent",
                name: "Agent",
              },
              {
                id: "Supplier",
                name: "Supplier",
              },
              {
                id: "Guest",
                name: "Guest",
              },
            ],
            required: true,
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Guest" table="profiles" field="first_name" />
<Form {form} table="profiles" />
