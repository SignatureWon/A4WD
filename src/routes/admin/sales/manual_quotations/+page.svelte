<script>
    import PageHeader from "$lib/components/PageHeader.svelte";
    import Table from "$lib/components/Table.svelte";
    const headers = [
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
  
  <PageHeader name="Quotations" table="forms" manual={true} />
  <Table
    table="forms"
    fields="id, reference, first_name, last_name"
    filters={[{
        type: "eq",
        column: "type",
        value: "quotations"
    }]}
    {headers}
  />
  