<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputManyRelation from "$lib/components/admin/InputManyRelation.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputImage from "$lib/components/admin/InputImage.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  export let data;

  const discountOptions = {
    Deduction: [
      { id: "Percentage", name: "Percentage" },
      { id: "Price", name: "Price" },
      { id: "No One Way Fee", name: "No One Way Fee" },
    ],
    "Early bird": [
      { id: "Percentage", name: "Percentage" },
      { id: "Price", name: "Price" },
      { id: "No One Way Fee", name: "No One Way Fee" },
    ],
    "Long term": [
      { id: "Percentage", name: "Percentage" },
      { id: "Price", name: "Price" },
      { id: "No One Way Fee", name: "No One Way Fee" },
    ],
    "Every X day": [{ id: "Day", name: "Day" }],
  };
</script>

<PageTitle title="Special" path={data.path} data={data.data} id={data.id} />
<Form id={data.id} path={data.path}>
  <FormSection title="Info">
    <InputText name="name" label="Name" bind:value={data.data.name} required={true} />
    <InputTextArea name="description" label="Description" bind:value={data.data.description} />
  </FormSection>
  <FormSection title="Date">
    <InputDateRange
      nameFrom="booking_start"
      nameTo="booking_end"
      labelFrom="Booking Start"
      labelTo="Booking End"
      bind:valueFrom={data.data.booking_start}
      bind:valueTo={data.data.booking_end}
    />
    <InputDateRange
      nameFrom="travel_start"
      nameTo="travel_end"
      labelFrom="Travel Start"
      labelTo="Travel End"
      bind:valueFrom={data.data.travel_start}
      bind:valueTo={data.data.travel_end}
    />
  </FormSection>
  <FormSection title="Image">
    <InputImage
      name="image"
      label="Featured Image"
      bind:value={data.data.image}
      bucket="contents"
      fetch={{
        table: "specials",
        id: data.id,
      }}
    />
    <InputText name="caption" label="Caption" bind:value={data.data.caption} />
  </FormSection>
  <FormSection title="Criteria">
    <InputManyRelation
      name="all_depots"
      label="Pick-up Depots"
      value={data.data.all_depots}
      table="specials_depots"
      options={data.depots}
      selected={data.depots_selected}
    />
    <InputManyRelation
      name="all_dropoffs"
      label="Drop-off Depots"
      value={data.data.all_dropoffs}
      table="specials_dropoffs"
      options={data.depots}
      selected={data.dropoffs_selected}
    />
    <InputManyRelation
      name="all_suppliers"
      label="Suppliers"
      value={data.data.all_suppliers}
      table="specials_suppliers"
      options={data.suppliers}
      selected={data.suppliers_selected}
    />
    <InputManyRelation
      name="all_vehicles"
      label="Vehicles"
      value={data.data.all_vehicles}
      table="specials_vehicles"
      options={data.vehicles}
      selected={data.vehicles_selected}
    />
  </FormSection>
  <FormSection title="Discount">
    <InputSelect
      name="type"
      label="Type"
      bind:value={data.data.type}
      options={[
        {
          id: "Deduction",
          name: "Deduction",
        },
        {
          id: "Early bird",
          name: "Early bird",
        },
        {
          id: "Long term",
          name: "Long term",
        },
        {
          id: "Every X day",
          name: "Every X day",
        },
      ]}
      half={true}
    />
    <InputToggle name="own" label="A4 Specials" bind:value={data.data.own} half={true} />
    {#if data.data.type === "Early bird"}
      <InputNumber name="days" label="X days before travel" bind:value={data.data.days} half={true} />
    {:else if data.data.type === "Long term"}
      <InputNumber name="days" label="Travel longer than X days" bind:value={data.data.days} half={true} />
    {:else if data.data.type === "Every X day"}
      <InputNumber name="days" label="On every X day" bind:value={data.data.days} half={true} />
    {/if}
    <InputToggle name="nett" label="Discount on Nett" bind:value={data.data.nett} half={true} />

    <InputSelect
      name="factor"
      label="Discount by"
      bind:value={data.data.factor}
      options={discountOptions[data.data.type] || []}
      half={true}
    />
    <!-- [
        {
          id: "Percentage",
          name: "Percentage",
        },
        {
          id: "Price",
          name: "Price",
        },
        {
          id: "Day",
          name: "Day",
        },
        {
          id: "No One Way Fee",
          name: "No One Way Fee",
        },
      ] -->
    {#if data.data.factor !== "No One Way Fee"}
      <InputNumber name="value" label="Value" bind:value={data.data.value} step={0.01} half={true} />
    {/if}
    <div class="bg-gray-100 p-4 md:col-span-2">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputToggle name="discount2" label="Second discount" bind:value={data.data.discount2} />

        {#if data.data.discount2}
          <InputSelect
            name="type2"
            label="Type"
            bind:value={data.data.type2}
            options={[
              {
                id: "Deduction",
                name: "Deduction",
              },
              {
                id: "Early bird",
                name: "Early bird",
              },
              {
                id: "Long term",
                name: "Long term",
              },
              {
                id: "Every X day",
                name: "Every X day",
              },
            ]}
            half={true}
          />
          <InputToggle name="own2" label="A4 Specials" bind:value={data.data.own2} half={true} />
          {#if data.data.type2 === "Early bird"}
            <InputNumber name="days2" label="X days before travel" bind:value={data.data.days2} half={true} />
          {:else if data.data.type2 === "Long term"}
            <InputNumber name="days2" label="Travel longer than X days" bind:value={data.data.days2} half={true} />
          {:else if data.data.type2 === "Every X day"}
            <InputNumber name="days2" label="On every X day" bind:value={data.data.days2} half={true} />
          {/if}
          <InputSelect
            name="factor2"
            label="Discount by"
            bind:value={data.data.factor2}
            options={discountOptions[data.data.type2] || []}
            half={true}
          />
          <InputToggle name="nett2" label="Discount on Nett" bind:value={data.data.nett2} half={true} />
          {#if data.data.factor2 !== "No One Way Fee"}
            <InputNumber name="value2" label="Value" bind:value={data.data.value2} step={0.01} half={true} />
          {/if}
        {/if}
      </div>
    </div>
  </FormSection>
</Form>
