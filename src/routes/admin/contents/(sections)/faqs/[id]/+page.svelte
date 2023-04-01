<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "FAQ",
    groups: [
      {
        name: "",
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
            name: "status",
            label: "Status",
            toggle: "Active",
            type: "switch",
            size: "half",
          },
          {
            name: "rank",
            label: "Rank",
            type: "number",
            size: "half",
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
