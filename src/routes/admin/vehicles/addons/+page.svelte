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
  ];
</script>

<PageHeader name="Addons" table="addons" />
<Table
  table="addons"
  {headers}
/>
