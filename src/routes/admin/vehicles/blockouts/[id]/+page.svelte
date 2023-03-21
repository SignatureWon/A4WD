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
            label: "Description",
            type: "text",
            required: true,
          },
          {
            name: "date_start",
            label: "Start date",
            name2: "date_end",
            label2: "End date",
            type: "daterange",
          },
        ],
      },
      {
        name: "Criteria",
        description: "",
        fields: [
          {
            name: "vehicles",
            label: "Vehicle",
            type: "related",
            related: "vehicles",
          },
          {
            name: "all_vehicles",
            label: "All vehicles",
            type: "switch",
          },
          {
            name: "depots",
            label: "Depot",
            type: "related",
            related: "depots",
          },
          {
            name: "all_depots",
            label: "All depots",
            type: "switch",
          },
          {
            name: "suppliers",
            label: "Supplier",
            type: "related",
            related: "suppliers",
          },
          {
            name: "all_suppliers",
            label: "All suppliers",
            type: "switch",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Blockout" table="blockouts" />
<Form {form} table="blockouts" />
