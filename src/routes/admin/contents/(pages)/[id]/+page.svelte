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
          // {
          //   name: "richtext",
          //   label: "Content",
          //   type: "richtext",
          // },
          {
            name: "content",
            label: "Content",
            type: "richtext",
          },
        ],
      },
      {
        name: "Info",
        description: "",
        fields: [
          {
            name: "categories",
            label: "Category",
            type: "related",
            related: "categories",
            filters: [{ type: "eq", column: "type", value: "pages" }]
          },
          {
            name: "featured",
            label: "Show on top navigation",
            type: "switch",
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
