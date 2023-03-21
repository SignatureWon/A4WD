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
  ];
</script>

<PageHeader name="Banners" table="contents" />
<Table
  table="contents"
  filters={[{ type: "eq", column: "type", value: "banners" }]}
  {headers}
/>
