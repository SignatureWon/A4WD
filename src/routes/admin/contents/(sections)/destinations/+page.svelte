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

<PageHeader name="Destinations" table="contents" />
<Table
  table="contents"
  filters={[{ type: "eq", column: "type", value: "destinations" }]}
  {headers}
/>
