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
  
  <PageHeader name="Bookings" table="forms" />
  <Table
    table="forms"
    fields="id, reference, created_at, first_name, last_name"
    filters={[{
        type: "eq",
        column: "type",
        value: "bookings"
    }]}
    {headers}
  />
  