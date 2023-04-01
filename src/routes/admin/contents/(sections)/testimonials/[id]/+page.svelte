<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Testimonial",
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
            name: "description",
            label: "Country",
            type: "text",
          },
          {
            name: "content",
            label: "Message",
            type: "textarea",
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
            default: "testimonials",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Testimonial" table="contents" />
<Form {form} table="contents" />
