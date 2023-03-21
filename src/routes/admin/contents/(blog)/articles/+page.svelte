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
  ];
</script>

<PageHeader name="Articles" table="contents" />
<Table
  table="contents"
  fields="id, name, categories (name)"
  filters={[{ type: "eq", column: "type", value: "articles" }]}
  {headers}
/>
