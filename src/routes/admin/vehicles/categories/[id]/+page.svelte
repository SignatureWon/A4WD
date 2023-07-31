<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  export let data;
</script>

<PageTitle title="Category" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText
      name="name"
      label="Name"
      bind:value={data.data.name}
      required={true}
    />
    <InputTextArea
      name="description"
      label="Description"
      bind:value={data.data.description}
    />
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
  <FormSection title="Publish">
    <InputNumber
      name="rank"
      label="Rank"
      bind:value={data.data.rank}
      half={true}
    />
  </FormSection>
  <input type="hidden" name="type" value="vehicles">
</Form>
