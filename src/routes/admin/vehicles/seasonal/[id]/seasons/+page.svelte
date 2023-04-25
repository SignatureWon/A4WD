<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";
  export let data;

  let parent = data.path.split("/");
  parent.pop();
  let tabs = [
    {
      name: "General",
      link: `${parent.join("/")}`,
    },
    {
      name: "Seasons",
      link: `#`,
    },
  ];
</script>

<PageTitle title="Seasonal" path={data.path} data={data.data} id={data.id} />
<Tabs {tabs} selected={1} />
<div class="mt-4">
<SectionDataTable
  rows={data.seasons}
  path={data.path}
  headers={[
    {
      key: "name",
      value: "Name",
    },
  ]}
/>

</div>
