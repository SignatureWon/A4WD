<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
</script>

<PageTitle title="Flex" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
    {
      key: "name",
      value: "Name",
    },
    {
      key: "suppliers.name",
      value: "Suppliers",
    },
  ]}
/>
