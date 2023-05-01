<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    // {
    //   key: "suppliers.name",
    //   value: "Suppliers",
    // },
  ];
</script>

<PageHeader name="Addons" table="addons" />
<Table
  table="addons"
  fields="id, name"
  {headers}
/>
