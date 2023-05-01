<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
</script>

<PageTitle title="Bonds" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
    {
      key: "name",
      value: "Name",
    },
    {
      key: "display_name",
      value: "Display Name",
    },
    {
      key: "status",
      value: "Status",
    },
    {
      key: "rank",
      value: "Rank",
    },
  ]}
/>
