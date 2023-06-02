<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";

  export let data;
  console.log(data);
</script>

<PageTitle title="Users" path={data.path} />

<SectionDataTable
  rows={data.data}
  path={data.path}
  headers={[
    {
      key: "first_name",
      value: "First Name",
    },
    {
      key: "last_name",
      value: "Last Name",
    },
    {
      key: "email",
      value: "Email",
    },
    {
      key: "phone",
      value: "Phone",
    },
    {
      key: "country",
      value: "Country",
    },
    {
      key: "created_at",
      value: "Date Joined",
    },
  ]}
/>
