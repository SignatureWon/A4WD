<script>
    import PageTitle from "$lib/components/admin/PageTitle.svelte";
    import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";
  
    export let data;
  </script>
  
  <PageTitle title="Booking" path={data.path} />
  
  <SectionDataTable
    rows={data.data}
    path={data.path}
    headers={[
      {
        key: "updated_at",
        value: "Last update",
      },
      {
        key: "users.first_name",
        value: "User",
      },
      {
        key: "status",
        value: "Status",
      },
      {
        key: "gross",
        value: "Gross",
      },
    ]}
  />
  