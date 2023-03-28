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
            name: "content",
            label: "Content",
            type: "textarea",
          },
          {
            name: "type",
            type: "hidden",
            default: "features",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Features" table="contents" />
<Form {form} table="contents" />
