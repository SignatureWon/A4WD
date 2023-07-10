<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
</script>

<PageTitle title="Quotation" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  prefix="Q"
  headers={[
    {
      key: "created_at",
      value: "Quote Date",
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
    {
      key: "status",
      value: "Status",
    },
  ]}
/>
