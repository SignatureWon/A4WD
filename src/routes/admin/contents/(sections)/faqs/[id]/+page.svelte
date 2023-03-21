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
            label: "Question",
            type: "text",
            required: true,
          },
          {
            name: "description",
            label: "Answer",
            type: "textarea",
            required: true,
          },
          {
            name: "type",
            type: "hidden",
            default: "faqs",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="FAQ" table="contents" />
<Form {form} table="contents" />
