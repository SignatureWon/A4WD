<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputJsonSpecifications from "$lib/components/admin/InputJsonSpecifications.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Vehicle" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={2} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputJsonSpecifications bind:value={data.data.specifications} />
  </FormSection>
</Form>
