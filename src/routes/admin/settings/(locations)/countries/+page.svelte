<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "currency",
      value: "Currency",
    },
  ];
</script>

<PageHeader name="Countries" />
<Table table="countries" {headers} />
