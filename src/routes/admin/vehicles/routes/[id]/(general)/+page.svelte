<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputManyRelation from "$lib/components/admin/InputManyRelation.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
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
  <FormSection title="Waive">
    <InputToggle
      name="waive"
      label="Waive one-way"
      bind:value={data.data.waive}
      half={true}
    />
    <InputNumber
      name="waive_days"
      label="Travel above days"
      bind:value={data.data.waive_days}
      half={true}
    />
  </FormSection>
  <FormSection title="Criteria">
    <InputManyRelation
      name="all_depots"
      label="depots"
      bind:value={data.data.all_depots}
      table="routes_depots"
      options={data.depots}
      selected={data.depots_selected}
    />
    <InputManyRelation
      name="all_suppliers"
      label="Suppliers"
      bind:value={data.data.all_suppliers}
      table="routes_suppliers"
      options={data.suppliers}
      selected={data.suppliers_selected}
    />
  </FormSection>
</Form>
