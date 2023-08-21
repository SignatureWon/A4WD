<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Table from "$lib/components/Table.svelte";
    const headers = [
      {
        key: "created_at",
        value: "Booking Date",
      },
      {
        key: "reference",
        value: "Reference",
      },
      {
        key: "first_name",
        value: "First Name",
      },
      {
        key: "last_name",
        value: "Last Name",
      },
    ];
  </script>
  
  <PageHeader name="Quotations" table="forms" />
  <Table
    table="forms"
    fields="id, created_at, reference, first_name, last_name"
    filters={[{
        type: "eq",
        column: "type",
        value: "quotations"
    }]}
    orders={[{
      column: "created_at",
      ascend: false
    }]}
    {headers}
  />
  