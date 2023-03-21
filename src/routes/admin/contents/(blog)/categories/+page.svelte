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

<PageHeader name="Categories" table="categories" />
<Table
  table="categories"
  filters={[{ type: "eq", column: "type", value: "articles" }]}
  {headers}
/>
