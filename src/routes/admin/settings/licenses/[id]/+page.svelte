<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "",
    groups: [
      {
        name: "",
        description: "",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
          {
            name: "rank",
            label: "Rank",
            type: "number",
          },
          {
            name: "type",
            default: "licenses",
            type: "hidden",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="License" table="constants" />
<Form {form} table="constants" />
