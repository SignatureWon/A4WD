<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Question",
    },
    {
      key: "status",
      value: "Status",
    },
    {
      key: "rank",
      value: "Rank",
    },
  ];
</script>

<PageHeader name="FAQs" table="contents" />
<Table
  table="contents"
  filters={[{ type: "eq", column: "type", value: "faqs" }]}
  orders={[
    {
      column: "rank",
      ascend: true
    }
  ]}
  {headers}
/>
