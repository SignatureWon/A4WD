<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  export let data;
</script>

<PageTitle title="Subscriber" path={data.path} />
<Form id={data.id} path={data.path}>
  <FormSection title="Details">
    <InputText
      name="email"
      label="Email"
      bind:value={data.data.email}
      required={true}
    />
  </FormSection>
</Form>
