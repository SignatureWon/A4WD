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
            label: "Title",
            type: "text",
            required: true,
          },
          {
            name: "description",
            label: "Subtitle",
            type: "text",
          },
          {
            name: "content",
            label: "Link",
            type: "text",
          },
          {
            name: "image",
            label: "Image",
            type: "image",
            bucket: "contents",
          },
          {
            name: "status",
            label: "Active",
            type: "switch",
          },
          {
            name: "type",
            type: "hidden",
            default: "banners",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Announcement" table="contents" />
<Form {form} table="contents" />
