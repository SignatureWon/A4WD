<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
  // console.log(data);
</script>

<PageTitle title="Pax Subscribed" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
    {
      key: "email",
      value: "Email",
    },
    {
      key: "created_at",
      value: "Date Subscribed",
    },
  ]}
/>
