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
      value: "State",
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

<PageHeader name="Travel Routes" table="contents" />
<Table
  table="contents"
  filters={[{ type: "eq", column: "type", value: "routes" }]}
  fields="id, name, status, rank, categories (name)"
  orders={[
    {
      column: "rank",
      ascend: true
    }
  ]}
  {headers}
/>
