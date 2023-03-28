<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "suppliers.name",
      value: "Suppliers",
    },
  ];
</script>

<PageHeader name="Flex" table="rates" />
<Table
  table="rates"
  fields="id, name, suppliers (name)"
  filters={[{ type: "eq", column: "type", value: "flex" }]}
  {headers}
/>
