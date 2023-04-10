<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Page",
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
          //   name: "content",
          //   label: "Content",
          //   type: "quill",
          // },
          // {
          //   name: "richtext",
          //   label: "Content",
          //   type: "richtext",
          // },
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
        ],
      },
      {
        name: "",
        description: "",
        fields: [
          {
            name: "categories",
            label: "Category",
            type: "related",
            related: "categories",
            filters: [{ type: "eq", column: "type", value: "pages" }],
          },
          {
            name: "featured",
            label: "Show on top navigation",
            type: "switch",
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
