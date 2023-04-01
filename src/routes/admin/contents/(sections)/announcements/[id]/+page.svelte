<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Announcement",
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
            label: "Link",
            type: "link",
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
            default: "announcements",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Announcement" table="contents" />
<Form {form} table="contents" />
