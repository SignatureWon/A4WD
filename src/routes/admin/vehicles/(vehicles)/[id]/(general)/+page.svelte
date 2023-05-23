<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputManyRelation from "$lib/components/admin/InputManyRelation.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputImage from "$lib/components/admin/InputImage.svelte";
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputSeasonalTiers from "$lib/components/admin/InputSeasonalTiers.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import { PageTabs } from "../../tabs";
  export let data;
  console.log(data);
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";

  onMount(async () => {
    const { data: vdata } = await supabase
      .from("vehicles")
      .select("id, name, categories (name)")
      .eq("id", data.id)
      .single();

    console.log("vdata", vdata);
  });

  // console.log(PageTabs(data.id));

  // let tabs = [
  //   {
  //     name: "General",
  //     link: "#",
  //   },
  //   // {
  //   //   name: "Seasons",
  //   //   link: `${data.path}/seasons`
  //   // },
  // ];
</script>

<PageTitle title="Vehicle" path={data.path} data={data.data} id={data.id} />
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
      name="code"
      label="Code"
      bind:value={data.data.code}
      required={true}
    />
    <InputSelect
      name="suppliers"
      label="Supplier"
      bind:value={data.data.suppliers}
      options={data.suppliers}
    />
    <InputManyRelation
      name="all_categories"
      label="Categories"
      value={data.data.all_categories}
      table="vehicles_categories"
      options={data.categories}
      selected={data.categories_selected}
    />
    <InputSelect
      name="age"
      label="Age"
      bind:value={data.data.age}
      options={data.ages}
    />
  </FormSection>
  <FormSection title="Publish">
    <InputToggle
      name="status"
      label="Status"
      bind:value={data.data.status}
      half={true}
    />
    <InputNumber
      name="rank"
      label="Rank"
      bind:value={data.data.rank}
      half={true}
    />
  </FormSection>
  <FormSection title="Image">
    <InputImage
      name="image"
      label="Featured Image"
      bind:value={data.data.image}
      bucket="contents"
      fetch={{
        table: "vehicles",
        id: data.id,
      }}
    />
    <InputText name="caption" label="Caption" bind:value={data.data.caption} />
  </FormSection>
  <FormSection title="Features">
    <InputNumber
      name="pax"
      label="Pax"
      bind:value={data.data.pax}
      half={true}
    />
    <InputSelect
      name="transmission"
      label="Transmission"
      bind:value={data.data.transmission}
      half={true}
      options={[
        {
          id: "Automatic",
          name: "Automatic",
        },
        {
          id: "Manual",
          name: "Manual",
        },
      ]}
    />
    <InputSelect
      name="fuel"
      label="Fuel"
      bind:value={data.data.fuel}
      half={true}
      options={[
        {
          id: "Petrol",
          name: "Petrol",
        },
        {
          id: "Diesel",
          name: "Diesel",
        },
        {
          id: "Petrol/Diesel",
          name: "Petrol/Diesel",
        },
      ]}
    />
    <InputSelect
      name="wheel"
      label="Driven Wheel"
      bind:value={data.data.wheel}
      half={true}
      options={[
        {
          id: "4WD",
          name: "4WD",
        },
        {
          id: "2WD",
          name: "2WD",
        },
      ]}
    />
    <InputToggle
      name="shower"
      label="Shower"
      bind:value={data.data.shower}
      half={true}
    />
    <InputToggle
      name="toilet"
      label="Toilet"
      bind:value={data.data.toilet}
      half={true}
    />
  </FormSection>
  <!-- <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.data.date_start}
      bind:valueTo={data.data.date_end}
    /> -->
  <!-- <InputToggle
      name="calendar"
      label="Calendar Day"
      bind:value={data.data.calendar}
    />
  </FormSection>
  <FormSection title="Driver">
    <InputSelect
      name="license"
      label="License"
      bind:value={data.data.license}
      options={data.licenses}
    /> -->
  <!-- </FormSection>
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
  <FormSection title="Tiered-rates">
    <InputSeasonalTiers
      bind:value={data.data.tiers}
    />
  </FormSection> -->
  <!-- <InputHidden name="type" value="seasonal" /> -->
</Form>
