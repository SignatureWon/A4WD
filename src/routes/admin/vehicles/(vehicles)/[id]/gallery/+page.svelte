<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputGallery from "$lib/components/admin/InputGallery.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  import { TextArea, TextInput } from "carbon-components-svelte";
  export let data;
</script>

<PageTitle title="Vehicle" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={4} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputGallery
      name="images"
      bind:value={data.data.images}
    />
  </FormSection>
</Form>
