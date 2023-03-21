<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "name",
      value: "Question",
    },
  ];
</script>

<PageHeader name="FAQs" table="contents" />
<Table
  table="contents"
  filters={[{ type: "eq", column: "type", value: "faqs" }]}
  {headers}
/>
