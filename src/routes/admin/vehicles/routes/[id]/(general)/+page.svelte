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

<PageTitle title="Route" path={data.path} data={data.data} id={data.id} />
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
  </FormSection>
  <FormSection title="Criteria">
    <InputManyRelation
      name="all_depots"
      label="depots"
      value={data.data.all_depots}
      table="routes_depots"
      options={data.depots}
      selected={data.depots_selected}
    />
    <InputManyRelation
      name="all_suppliers"
      label="Suppliers"
      value={data.data.all_suppliers}
      table="routes_suppliers"
      options={data.suppliers}
      selected={data.suppliers_selected}
    />
  </FormSection>
</Form>
