<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    // {
    //   key: "suppliers",
    //   value: "Suppliers",
    // },
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

<PageHeader name="Bonds" table="packages" />
<Table
  table="packages"
  fields="id, name, status, rank"
  {headers}
/>
