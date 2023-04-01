<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "categories.name",
      value: "Category",
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

<PageHeader name="Pages" table="contents" />
<Table
  table="contents"
  fields="id, name, categories (name), status, rank"
  filters={[{ type: "eq", column: "type", value: "pages" }]}
  orders={[
    {
      column: "rank",
      ascend: true
    }
  ]}
  {headers}
/>
