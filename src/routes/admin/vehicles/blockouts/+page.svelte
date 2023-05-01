<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
</script>

<PageTitle title="Blockouts" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
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
  ]}
/>
