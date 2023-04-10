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
          },
          {
            name: "description",
            label: "Description",
            type: "textarea",
          },
          {
            name: "rank",
            label: "Rank",
            type: "number",
          },
          {
            name: "type",
            default: "vehicles",
            type: "hidden",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Category" table="categories" />
<Form {form} table="categories" />
