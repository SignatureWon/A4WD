<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import PageSubTitle from "$lib/components/admin/PageSubTitle.svelte";
  import Tabs from "$lib/components/admin/Tabs.svelte";
  import Form from "$lib/components/admin/Form.svelte";
  import FormSection from "$lib/components/admin/FormSection.svelte";
  import InputText from "$lib/components/admin/InputText.svelte";
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

<PageTitle title="Seasonal" path={data.path} data={data.seasonal} id={data.id} />
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
    <InputDateRange
      nameFrom="date_start"
      nameTo="date_end"
      labelFrom="Start Date"
      labelTo="End Date"
      bind:valueFrom={data.season.date_start}
      bind:valueTo={data.season.date_end}
    />
  </FormSection>
  {#if data.season_id !== "add"}
    <FormSection title="Rates">
      <InputSeasonalRates value={data.season.tiers} tiers={data.seasonal.tiers} depots={data.depots} vehicles={data.vehicles} />
    </FormSection>
  {/if}
  <InputHidden name="rates" value={data.id} />
</Form>
<!-- keys: ["name", "rates", "all_depots", "all_vehicles", "daily", "tiers"], -->
