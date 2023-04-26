<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Name",
    },
    {
      key: "suppliers.name",
      value: "Supplier",
    },
    {
      key: "travel_start",
      value: "Travel Start",
    },
    {
      key: "travel_end",
      value: "Travel End",
    },
  ];
</script>

<PageHeader name="Terms" table="terms" />
<Table
  table="terms"
  fields="id, name, travel_start, travel_end, suppliers (name)"
  {headers}
/>
