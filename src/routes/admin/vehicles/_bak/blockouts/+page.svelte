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
      value: "Start Date",
    },
    {
      key: "date_end",
      value: "End Date",
    },
    {
      key: "status",
      value: "Status",
    },
  ];
</script>

<PageHeader name="Blockouts" table="blockouts" />
<Table
  table="blockouts"
  {headers}
/>
