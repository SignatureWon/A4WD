<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
  // console.log(data);
</script>

<PageTitle title="Admin" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
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
      key: "role",
      value: "Role",
    },
    {
      key: "created_at",
      value: "Date Joined",
    },
  ]}
/>
