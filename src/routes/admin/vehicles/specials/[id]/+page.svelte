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
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputSeasonalTiers from "$lib/components/admin/InputSeasonalTiers.svelte";
  import { Select, SelectItem } from "carbon-components-svelte";
  export let data;
</script>

<PageTitle title="Special" path={data.path} data={data.data} id={data.id} />
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
    <!-- <InputSelect
      name="suppliers"
      label="Supplier"
      bind:value={data.data.suppliers}
      options={data.suppliers}
    /> -->
    <!-- <InputToggle
      name="calendar"
      label="Calendar Day"
      bind:value={data.data.calendar}
    /> -->
  </FormSection>
  {#if data.id !== "add"}
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
    <FormSection title="Criteria">
      <InputManyRelation
        name="all_depots"
        label="Depots"
        value={data.data.all_depots}
        table="specials_depots"
        options={data.depots}
        selected={data.depots_selected}
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
      <div class="md:col-span-2">
        <Select labelText="Type" name="type" bind:selected={data.data.type}>
          <SelectItem value="deduction" text="Deduction" />
          <SelectItem value="early_bird" text="Early bird" />
          <SelectItem value="long_term" text="Long term" />
          <SelectItem value="x_day" text="Every X day" />
        </Select>
      </div>
      {#if data.data.type === "x_day"}
        <InputNumber name="value" label="On every X day" value="" />
      {/if}
      <div class="md:col-span-2">
        <Select labelText="Discount" name="discount">
          <SelectItem value="by_percentage" text="By percentage" />
          <SelectItem value="by_price" text="By price" />
          <SelectItem value="by_day" text="By day" />
        </Select>
      </div>
      <div class="md:col-span-2">
        <Select labelText="Discount" name="discount">
          <SelectItem value="by_percentage" text="By percentage" />
          <SelectItem value="by_price" text="By price" />
          <SelectItem value="by_day" text="By day" />
        </Select>
      </div>
      <InputNumber name="value" label="Value" value="" />
    </FormSection>
  {/if}

  <!-- <FormSection title="Factors">
    <InputNumber
      name="nett"
      label="Nett Factor (Percentage)"
      bind:value={data.data.nett}
      half={true}
    />
    <InputNumber
      name="gross"
      label="Gross Factor (Percentage)"
      bind:value={data.data.gross}
      half={true}
    />
  </FormSection>
  <FormSection title="Tiered-rates">
    <InputSeasonalTiers
      bind:value={data.data.tiers}
    />
  </FormSection>
  <InputHidden name="type" value="seasonal" /> -->
</Form>
