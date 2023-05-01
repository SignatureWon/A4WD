<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputManyRelation from "$lib/components/admin/InputManyRelation.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
</script>

<PageTitle title="Bond" path={data.path} data={data.data} id={data.id} />
<Tabs tabs={PageTabs(data.id)} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText
      name="name"
      label="Name"
      bind:value={data.data.name}
      required={true}
    />
    <InputText
      name="display_name"
      label="Display Name"
      bind:value={data.data.display_name}
      required={true}
    />
    <InputText name="code" label="Code" bind:value={data.data.code} />
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
      name="all_suppliers"
      label="Suppliers"
      value={data.data.all_suppliers}
      table="packages_suppliers"
      options={data.suppliers}
      selected={data.suppliers_selected}
    />
    <InputManyRelation
      name="all_vehicles"
      label="Vehicles"
      value={data.data.all_vehicles}
      table="packages_vehicles"
      options={data.vehicles}
      selected={data.vehicles_selected}
    />
  </FormSection>
  <FormSection title="Rates">
    <InputNumber
      name="nett"
      label="Nett Daily Rate"
      bind:value={data.data.nett}
      step={0.01}
      half={true}
    />
    <InputNumber
      name="gross"
      label="Gross Daily Rate"
      bind:value={data.data.gross}
      step={0.01}
      half={true}
    />
    <InputNumber
      name="cap"
      label="Rate Cap (Days)"
      bind:value={data.data.cap}
      half={true}
    />
    <InputNumber
      name="deposit"
      label="Security Deposit"
      bind:value={data.data.deposit}
      step={0.01}
      half={true}
    />
    <InputNumber
      name="liability"
      label="Liability"
      bind:value={data.data.liability}
      step={0.01}
      half={true}
    />
    <InputNumber
      name="bond"
      label="Bond"
      bind:value={data.data.bond}
      step={0.01}
      half={true}
    />
  </FormSection>
  <FormSection title="Info">
    <InputTextArea
      name="description"
      label="Description"
      bind:value={data.data.description}
    />
    <InputTextArea
      name="inclusions"
      label="Inclusions"
      bind:value={data.data.inclusions}
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
</Form>
