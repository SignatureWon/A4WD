<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputJson from "$lib/components/admin/InputJson.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  import { TextArea, TextInput } from "carbon-components-svelte";
  export let data;
</script>

<PageTitle title="Vehicle" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} selected={2} />
<Form id={data.id} path={data.path}>
  <FormSection>
    <InputJson
      name="specifications"
      schema={{
        Title: "Title",
        Description: "",
      }}
      bind:value={data.data.specifications}
      let:row
    >
      <TextInput labelText="Title" value={row.Title} class="mb-5" />
      <TextArea labelText="Description" value={row.Description} />
    </InputJson>
  </FormSection>
</Form>
