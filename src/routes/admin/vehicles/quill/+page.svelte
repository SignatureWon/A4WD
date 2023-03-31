<script>
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
            type: "quill",
          },
        ],
      },
    ],
  };

</script>
      <Form {form} />
