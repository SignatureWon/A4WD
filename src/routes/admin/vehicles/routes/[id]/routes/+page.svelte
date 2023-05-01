<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputRoutes from "$lib/components/admin/InputRoutes.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Addons" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={1} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputRoutes bind:value={data.data.routes} depots={data.depots}  />
  </FormSection>
</Form>
