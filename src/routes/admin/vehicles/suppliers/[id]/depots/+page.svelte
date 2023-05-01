<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputJsonDepots from "$lib/components/admin/InputJsonDepots.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Bond" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={1} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputJsonDepots bind:value={data.data.depots} depots={data.depots} />
  </FormSection>
</Form>
