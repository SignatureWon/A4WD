<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputJsonFaqs from "$lib/components/admin/InputJsonFaqs.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Vehicle" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={3} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputJsonFaqs bind:value={data.data.faqs} />
  </FormSection>
</Form>
