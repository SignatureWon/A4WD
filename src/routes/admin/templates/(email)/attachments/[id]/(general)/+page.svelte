<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputImage from "$lib/components/admin/InputImage.svelte";
  import InputFile from "$lib/components/admin/InputFile.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  export let data;
  console.log(data);
</script>

<PageTitle title="Attachment" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path}>
  <FormSection title="">
    <InputText
      name="name"
      label="Name"
      bind:value={data.data.name}
      required={true}
    />
  </FormSection>
  <FormSection title="Attachment">
    <InputFile
      name="attachment"
      label="File"
      bind:value={data.data.attachment}
      bucket="terms"
      fetch={{
        table: "contents",
        id: data.id,
      }}
    />
  </FormSection>
  <FormSection title="Navigation">
    <InputSelect
      name="categories"
      label="Category"
      bind:value={data.data.categories}
      options={data.categories}
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
  <input type="hidden" name="type" value="attachments">
</Form>
