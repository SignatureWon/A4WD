<script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Table from "$lib/components/Table.svelte";
  const headers = [
    {
      key: "email",
      value: "Email",
    },
    {
      key: "first_name",
      value: "First Name",
    },
    {
      key: "last_name",
      value: "Last Name",
    },
    {
      key: "created_at",
      value: "Date Joined",
    },
  ];
</script>

<PageHeader name="Pax Enquiry" table="profiles" field="first_name" />
<Table
  table="profiles"
  filters={[{ type: "eq", column: "role", value: "Guest" }]}
  {headers}
/>
