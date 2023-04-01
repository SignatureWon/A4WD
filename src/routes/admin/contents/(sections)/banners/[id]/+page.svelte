<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Banner",
    groups: [
      {
        name: "",
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
            name: "image",
            label: "Image",
            type: "image",
            bucket: "contents",
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
