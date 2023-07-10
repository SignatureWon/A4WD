<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
  console.log(data);
</script>

<PageTitle title="Final Ticket" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  prefix="FT"
  headers={[
    {
      key: "date_balance",
      value: "FT Date",
    },
    {
      key: "quote_id",
      value: "Ref Code",
    },
    {
      key: "quote_title",
      value: "Title",
    },
    {
      key: "quote_customer",
      value: "Customer",
    },
    // {
    //   key: "status",
    //   value: "Status",
    // },
  ]}
/>
