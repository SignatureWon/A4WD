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
            label: "Content",
            type: "richtext",
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
