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
    {
      key: "date_start",
      value: "Start Date",
    },
    {
      key: "date_end",
      value: "End Date",
    },
  ];
</script>

<PageHeader name="Seasonal" table="rates" />
<Table
  table="rates"
  fields="id, name, suppliers (name), date_start, date_end"
  filters={[{ type: "eq", column: "type", value: "seasonal" }]}
  {headers}
/>
