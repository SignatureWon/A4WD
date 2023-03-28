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
      value: "Supplier",
    },
    {
      key: "status",
      value: "Status",
    },
    {
      key: "rank",
      value: "Rank",
    },
  ];
</script>

<PageHeader name="Vehicles" table="vehicles" />
<Table
  table="vehicles"
  fields="id, name, status, rank, suppliers (name)"
  orders={[
    {
      column: "rank",
      ascend: false
    }
  ]}
  {headers}
/>
