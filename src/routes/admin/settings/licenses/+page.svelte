<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "rank",
      value: "Rank",
    },
  ];
</script>

<PageHeader name="Licenses" table="constants" />
<Table
  table="constants"
  filters={[{ type: "eq", column: "type", value: "licenses" }]}
  orders={[{ column: "rank", ascend: true }]}
  {headers}
/>
