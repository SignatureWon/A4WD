<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
  ];
</script>

<PageHeader name="Countries" table="constants" />
<Table
  table="constants"
  filters={[{ type: "eq", column: "type", value: "countries" }]}
  {headers}
/>
