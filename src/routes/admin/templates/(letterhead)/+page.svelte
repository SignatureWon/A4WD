<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputImage from "$lib/components/admin/InputImage.svelte";
  import InputFile from "$lib/components/admin/InputFile.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputRichText from "$lib/components/admin/InputRichText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import { Button, Tag } from "carbon-components-svelte";
  export let data;
</script>

<PageTitle title="Letterhead" />
<form method="POST" action="?/update" class="bg-white divide-y divide-gray-200">
  <FormSection title="">
    <InputText
      name="name"
      label="Company Name"
      bind:value={data.data.name}
      required={true}
    />
    <InputText
      name="description"
      label="Company Registration Number"
      bind:value={data.data.description}
    />
    <InputTextArea
      name="content"
      label="Company Contact"
      bind:value={data.data.content}
    />
  </FormSection>
  <footer class="text-right p-5">
    <Button type="submit">Update</Button>
  </footer>
</form>
