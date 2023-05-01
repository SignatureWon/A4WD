<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputImage from "$lib/components/admin/InputImage.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Page" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} />
<Form id={data.id} path={data.path}>
  <FormSection title="">
    <InputText
      name="name"
      label="Name"
      bind:value={data.data.name}
      required={true}
    />
    <InputRichText
      name="content"
      label="Content"
      bind:value={data.data.content}
    />
  </FormSection>
  <FormSection title="Image">
    <InputImage
      name="image"
      label="Featured Image"
      bind:value={data.data.image}
      bucket="contents"
      fetch={{
        table: "vehicles",
        id: data.id,
      }}
    />
    <InputText name="caption" label="Caption" bind:value={data.data.caption} />
  </FormSection>
  <FormSection title="Navigation">
    <InputSelect
      name="categories"
      label="Category"
      bind:value={data.data.categories}
      options={data.categories}
      half={true}
    />
    <InputToggle
      name="featured"
      label="Show on top navigation"
      bind:value={data.data.featured}
      half={true}
    />
  </FormSection>

  <FormSection title="Publish">
    <InputToggle
      name="status"
      label="Status"
      bind:value={data.data.status}
      init="true"
      half={true}
    />
    <InputNumber
      name="rank"
      label="Rank"
      bind:value={data.data.rank}
      half={true}
    />
  </FormSection>
</Form>
