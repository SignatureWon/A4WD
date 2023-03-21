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

<PageHeader name="Suppliers" table="suppliers" />
<Table
  table="suppliers"
  {headers}
/>
