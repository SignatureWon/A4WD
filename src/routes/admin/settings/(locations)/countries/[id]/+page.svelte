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
            name: "currency",
            label: "Currency",
            type: "text",
            required: true,
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Country" />
<Form {form} table="countries" />
