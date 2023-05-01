<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "date_start",
      value: "Date start",
    },
    {
      key: "date_end",
      value: "Date end",
    },
  ];
</script>

<PageHeader name="Routes" table="routes" />
<Table
  table="routes"
  {headers}
/>
