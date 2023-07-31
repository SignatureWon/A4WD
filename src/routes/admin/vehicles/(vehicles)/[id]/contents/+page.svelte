<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Vehicle" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={1} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputText name="excerpt" label="Short Description" bind:value={data.data.excerpt} />
    <InputRichText name="description" label="Description" bind:value={data.data.description} />
  </FormSection>
  <FormSection title="SEO">
    <InputText
      name="meta_title"
      label="Title"
      bind:value={data.data.meta_title}
      helper={`${(data.data.meta_title || "").length} / 60 (maximum recommended limit)`}
    />
    <InputTextArea
      name="meta_description"
      label="Meta Description"
      bind:value={data.data.meta_description}
      helper={`${(data.data.meta_description || "").length} / 160 (maximum recommended limit)`}
    />
  </FormSection>
  <FormSection>
    <InputRichText name="specs" label="Specs (Show in quotation)" bind:value={data.data.specs} />
    <InputRichText name="restrictions" label="Restrictions" bind:value={data.data.restrictions} />
    <InputRichText name="notes" label="Notes" bind:value={data.data.notes} />
  </FormSection>
</Form>
