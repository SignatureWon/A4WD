<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputJsonSeasonalRates from "$lib/components/admin/InputJsonSeasonalRates.svelte";
  // import InputSeasonalTiers from "$lib/components/admin/InputSeasonalTiers.svelte";
  export let data;
  console.log(data);
</script>

<PageTitle title="Seasonal" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText name="name" label="Name" bind:value={data.data.name} required={true} />
    <InputSelect name="suppliers" label="Supplier" bind:value={data.data.suppliers} options={data.suppliers} />
    <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.data.date_start}
      bind:valueTo={data.data.date_end}
    />
    <InputToggle name="calendar" label="Calendar Day" bind:value={data.data.calendar} />
    <InputNumber name="rank" label="Rank" bind:value={data.data.rank} half={true} />
  </FormSection>
  <FormSection title="Driver">
    <InputSelect
      name="license"
      label="License"
      bind:value={data.data.license}
      options={[
        {
          id: "",
          name: "Any license",
        },
        ...data.licenses,
      ]}
    />
  </FormSection>
  <FormSection title="Factors">
    <InputNumber
      name="nett"
      label="Nett Factor (Percentage)"
      bind:value={data.data.nett}
      step={0.01}
      half={true}
    />
    <InputNumber
      name="gross"
      label="Gross Factor (Percentage)"
      bind:value={data.data.gross}
      step={0.01}
      half={true}
    />
  </FormSection>
  <FormSection title="Tier Type">
    <InputToggle name="tiers_fixed" label="Multiple tiers" bind:value={data.data.tiers_fixed} />
  </FormSection>

  <FormSection>
    <InputJsonSeasonalRates bind:value={data.data.fees} nett={data.data.nett} gross={data.data.gross} depots={data.depots} vehicles={data.vehicles} />
  </FormSection>
  <InputHidden name="type" value="seasonal" />
</Form>
