<!-- <script>
  import PageHeader from "$lib/components/PageHeader.svelte";
  import Form from "$lib/components/Form.svelte";
  const form = {
    name: "Travel Routes",
    groups: [
      {
        name: "",
        description: "",
        fields: [
          {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
          },
          {
            name: "content",
            label: "Content",
            type: "trixeditor",
          },
        ],
      },
      {
        name: "",
        description: "",
        fields: [
          {
            name: "status",
            label: "Status",
            toggle: "Active",
            type: "switch",
            size: "half",
          },
          {
            name: "rank",
            label: "Rank",
            type: "number",
            size: "half",
          },
          {
            name: "description",
            label: "Embed Map",
            type: "textarea",
          },
          {
            name: "image",
            label: "Image",
            type: "image",
            bucket: "contents",
          },
          {
            name: "caption",
            label: "Image Caption",
            type: "text",
          },
          {
            name: "type",
            type: "hidden",
            default: "routes",
          },
        ],
      },
    ],
  };
</script>

<PageHeader name="Travel Route" table="contents" />
<Form {form} table="contents" /> -->
<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputImage from "$lib/components/admin/InputImage.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  export let data;
</script>

<PageTitle title="Route" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path}>
  <FormSection title="">
    <InputText name="name" label="Name" bind:value={data.data.name} required={true} />
    <InputSelect
      name="categories"
      label="Category"
      bind:value={data.data.categories}
      options={data.categories}
    />
    <!-- <InputSelect
      name="group"
      label="State"
      bind:value={data.data.group}
      options={[
        {id: "New South Wales",value: "New South Wales"},
        {id: "Northern Territory",value: "Northern Territory"},
        {id: "Queensland",value: "Queensland"},
        {id: "South Australia",value: "South Australia"},
        {id: "Tasmania",value: "Tasmania"},
        {id: "Victoria",value: "Victoria"},
        {id: "Western Australia",value: "Western Australia"},
      ]}
      half={true}
    /> -->
    <InputRichText name="content" label="Content" bind:value={data.data.content} />
    <InputTextArea name="meta_description" label="SEO: Meta Description" bind:value={data.data.meta_description} />
  </FormSection>
  <FormSection title="Image">
    <InputImage
      name="image"
      label="Featured Image"
      bind:value={data.data.image}
      bucket="contents"
      fetch={{
        table: "contents",
        id: data.id,
      }}
    />
    <InputText name="caption" label="Caption" bind:value={data.data.caption} />
  </FormSection>
  <FormSection title="Embed">
    <InputTextArea name="description" label="Google Maps" bind:value={data.data.description} />
  </FormSection>
  <FormSection title="Publish">
    <InputToggle name="status" label="Status" bind:value={data.data.status} init="true" half={true} />
    <InputNumber name="rank" label="Rank" bind:value={data.data.rank} half={true} />
  </FormSection>
  <input type="hidden" name="type" value="routes" />
</Form>
