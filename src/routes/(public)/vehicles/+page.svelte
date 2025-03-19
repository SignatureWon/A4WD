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
  <meta property="og:title" content="Vehicles - {data.site.title}" />
  <meta property="og:description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:image" content={data.site.image} />
  <link rel="canonical" href="https://australia4wdrentals.com/vehicles" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/vehicles",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${`${data.pageTitle.name}. ${data.pageTitle.subtitle}`}",
    "email": "info@australia4wdrentals.com.au",
    "image": "${data.site.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "Vehicles - ${data.site.title}"
  }
  </script>`}
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
