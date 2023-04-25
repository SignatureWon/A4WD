<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
</script>

<PageTitle title="Specials" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
    {
      key: "name",
      value: "Name",
    },
    {
      key: "type",
      value: "Type",
    },
    {
      key: "travel_start",
      value: "Travel Start",
    },
    {
      key: "travel_end",
      value: "Travel End",
    },
  ]}
/>