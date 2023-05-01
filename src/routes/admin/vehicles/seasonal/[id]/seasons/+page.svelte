<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  import SectionDataTable from "$lib/components/admin/SectionDataTable.svelte";
  export let data;
</script>

<PageTitle title="Seasonal" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={1} />
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
