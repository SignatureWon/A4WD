<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputManyRelation from "$lib/components/admin/InputManyRelation.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import {PageTabs} from "../../tabs"
  export let data;
</script>

<PageTitle title="Addons" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText
      name="name"
      label="Name"
      bind:value={data.data.name}
      required={true}
    />
    <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.data.date_start}
      bind:valueTo={data.data.date_end}
    />
    <InputText
      name="link"
      label="Link"
      bind:value={data.data.link}
    />
  </FormSection>
  <FormSection title="Criteria">
    <InputManyRelation
      name="all_suppliers"
      label="Suppliers"
      value={data.data.all_suppliers}
      table="addons_suppliers"
      options={data.suppliers}
      selected={data.suppliers_selected}
    />
    <InputManyRelation
      name="all_vehicles"
      label="Vehicles"
      value={data.data.all_vehicles}
      table="addons_vehicles"
      options={data.vehicles}
      selected={data.vehicles_selected}
    />
  </FormSection>
</Form>
