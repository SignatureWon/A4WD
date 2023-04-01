<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Article",
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
            name: "categories",
            label: "Category",
            type: "related",
            related: "categories",
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
            default: "articles",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Article" table="contents" />
<Form {form} table="contents" />
