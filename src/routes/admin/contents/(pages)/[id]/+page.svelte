<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Page",
    groups: [
      {
        name: "Content",
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
            name: "image",
            label: "Image",
            type: "image",
            bucket: "contents",
          },
          {
            name: "type",
            type: "hidden",
            default: "pages",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Page" table="contents" />
<Form {form} table="contents" />
