<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputManyRelation from "$lib/components/admin/InputManyRelation.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  export let data;
</script>

<PageTitle title="Addons" path={data.path} data={data.data} id={data.id} />
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
    <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.data.date_start}
      bind:valueTo={data.data.date_end}
    />
  </FormSection>
  <FormSection title="Criteria">
    <InputManyRelation
      name="all_depots"
      label="Depots"
      value={data.data.all_depots}
      table="blockouts_depots"
      options={data.depots}
      selected={data.depots_selected}
    />
    <InputManyRelation
      name="all_suppliers"
      label="Suppliers"
      value={data.data.all_suppliers}
      table="blockouts_suppliers"
      options={data.suppliers}
      selected={data.suppliers_selected}
    />
    <InputManyRelation
      name="all_vehicles"
      label="Vehicles"
      value={data.data.all_vehicles}
      table="blockouts_vehicles"
      options={data.vehicles}
      selected={data.vehicles_selected}
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
  </FormSection>
</Form>
