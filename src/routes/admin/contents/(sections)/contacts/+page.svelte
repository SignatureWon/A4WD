<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Type",
    },
    {
      key: "content",
      value: "Value",
    },
  ];
</script>

<PageHeader name="Contacts" table="contents" />
<Table
  table="contents"
  filters={[{ type: "eq", column: "type", value: "contacts" }]}
  {headers}
/>
