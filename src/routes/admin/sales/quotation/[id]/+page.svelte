<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";

  export let data;
    console.log(data);
</script>

<PageTitle title="Q{388000 + data.quote.id}" path={data.path} id={data.id} />
<Form id={data.id} path={data.path}>
    <FormSection title="Info">II</FormSection>
</Form>
  