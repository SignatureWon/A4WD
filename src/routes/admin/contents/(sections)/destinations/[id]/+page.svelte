<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Destination",
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
            type: "trixeditor",
          },
        ],
      },
      {
        name: "",
        description: "",
        fields: [
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
            name: "description",
            label: "Embed Map",
            type: "textarea",
          },
          {
            name: "image",
            label: "Image",
            type: "image",
            bucket: "contents",
          },
          {
            name: "caption",
            label: "Image Caption",
            type: "text",
          },
          {
            name: "type",
            type: "hidden",
            default: "destinations",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Destinations" table="contents" />
<Form {form} table="contents" />
