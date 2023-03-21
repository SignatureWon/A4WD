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
              name: "description",
              label: "Country",
              type: "text",
            },
            {
              name: "content",
              label: "Message",
              type: "textarea",
            },
            // {
            //   name: "image",
            //   label: "Image",
            //   type: "image",
            //   bucket: "contents",
            // },
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
  
  <PageHeader name="General" />
  <!-- <Form {form} table="contents" /> -->
  