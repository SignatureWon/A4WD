<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
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
    <InputRichText
      name="description"
      label="Description"
      bind:value={data.data.description}
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
  <input type="hidden" name="type" value="vehicles">
</Form>
