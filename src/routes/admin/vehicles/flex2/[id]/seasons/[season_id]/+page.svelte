<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import PageSubTitle from "$lib/components/admin/PageSubTitle.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
  import InputTextArea from "$lib/components/admin/InputTextArea.svelte";
  import InputToggle from "$lib/components/admin/InputToggle.svelte";
  import InputHidden from "$lib/components/admin/InputHidden.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import InputSeasonalRates from "$lib/components/admin/InputSeasonalRates.svelte";
  export let data;
  let tabs = [
    {
      name: "General",
      link: data.path.split("/seasons")[0],
    },
    {
      name: "Seasons",
      link: `#`,
    },
  ];
</script>

<PageTitle title="Flex" path={data.path} data={data.seasonal} id={data.id} />
<Tabs {tabs} selected={1} />
<Form id={data.season_id} path={data.path}>
  <PageSubTitle title="Season" id={data.season_id} data={data.season} />
  <FormSection title="Info">
    <InputText
      name="name"
      label="Name"
      bind:value={data.season.name}
      required={true}
    />
    <InputTextArea
      name="matrix"
      label="Matrix"
      bind:value={data.season.matrix}
      required={true}
    />
    <InputTextArea
      name="flex"
      label="Flex"
      bind:value={data.season.flex}
      required={true}
    />
    <InputToggle
      name="zero"
      label="Matrix startd from zero"
      bind:value={data.season.zero}
    />

    <!-- <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.season.date_start}
      bind:valueTo={data.season.date_end}
    /> -->
  </FormSection>
  <!-- {#if data.season_id !== "add"}
    <FormSection title="Rates">
      <InputSeasonalRates value={data.season.tiers} tiers={data.seasonal.tiers} depots={data.depots} vehicles={data.vehicles} />
    </FormSection>
  {/if} -->
  <InputHidden name="rates" value={data.id} />
</Form>
<!-- keys: ["name", "rates", "all_depots", "all_vehicles", "daily", "tiers"], -->
