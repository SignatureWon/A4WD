<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "code",
      value: "Code",
    },
  ];
</script>

<PageHeader name="Depots" table="depots" />
<Table
  table="depots"
  {headers}
/>
