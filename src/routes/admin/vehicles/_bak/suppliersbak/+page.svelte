<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
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

<PageHeader name="Suppliers" table="suppliers" />
<Table
  table="suppliers"
  orders={[
    {
      column: "rank",
      ascend: true,
    },
  ]}
  {headers}
/>
