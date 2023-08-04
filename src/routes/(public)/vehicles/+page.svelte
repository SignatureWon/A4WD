<script>
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  // import List from "$lib/components/public/archive/List.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  // import ListFilter from "$lib/components/public/archive/ListFilter.svelte";
  import Vehicle from "$lib/components/public/archive/card/Vehicle.svelte";
  export let data;
  // console.log(data);

  let records = [];
</script>

<svelte:head>
  <title>Vehicles - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>
<Filter
  title="Vehicles"
  keyword={data.keyword}
  category={data.category}
  url="/vehicles"
  options={[
    { name: "4WD Campers", value: "4wd-campers" },
    { name: "4WD Cars", value: "4wd-cars" },
    { name: "2WD Campers", value: "2wd-campers" },
    { name: "2WD Cars", value: "2wd-cars" },
  ]}
/>
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  category={data.category}
  records={data.vehicles}
  url="/vehicles"
>
  {#each data.vehicles as record}
    <Vehicle {record} />
  {/each}
</Grid>

<!-- <ListFilter
  filters={[
    {
      key: "wheel",
      label: "Type",
      options: [
        {
          key: "4WD",
          label: "4WD",
        },
        {
          key: "2WD",
          label: "2WD",
        },
      ],
    },
  ]}
/>
<List
  bind:records
  fetch={{
    from: "vehicles",
    select: "*",
  }}
>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    {#each records as record}
      <Vehicle {record} />
    {/each}
  </div>
</List> -->
