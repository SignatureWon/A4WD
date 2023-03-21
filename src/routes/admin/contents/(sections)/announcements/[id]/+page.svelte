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
            name: "content",
            label: "Link",
            type: "text",
          },
          {
            name: "status",
            label: "Active",
            type: "switch",
          },
          {
            name: "type",
            type: "hidden",
            default: "announcements",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Announcement" table="contents" />
<Form {form} table="contents" />
