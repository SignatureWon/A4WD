<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Supplier" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText name="name" label="Name" bind:value={data.data.name} required={true} />
    <InputText name="url" label="Check-in URL" bind:value={data.data.url} />
    <InputText name="phone" label="Customer Service Number" bind:value={data.data.phone} />
  </FormSection>
  <FormSection title="Time">
    <InputText name="start_time" label="Start Time" type="time" bind:value={data.data.start_time} half={true} />
    <InputText name="end_time" label="End Time" type="time" bind:value={data.data.end_time} half={true} />
  </FormSection>
  <FormSection title="Publish">
    <InputToggle name="status" label="Status" bind:value={data.data.status} init="true" half={true} />
    <InputNumber name="rank" label="Rank" bind:value={data.data.rank} half={true} />
  </FormSection>
</Form>
