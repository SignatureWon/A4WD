<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Route from "$lib/components/public/archive/card/Route.svelte";

  export let data;
</script>

<svelte:head>
  <title>Routes - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:title" content="Routes - {data.site.title}" />
  <meta property="og:description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:image" content={data.site.image} />
  <link rel="canonical" href="https://australia4wdrentals.com/routes" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/routes",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${`${data.pageTitle.name}. ${data.pageTitle.subtitle}`}",
    "email": "info@australia4wdrentals.com.au",
    "image": "${data.site.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "Routes - ${data.site.title}"
  }
  </script>`}
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Routes" keyword={data.keyword} url="/routes" />
<Grid page={data.pageCurrent} total={data.pageTotal} keyword={data.keyword} records={data.routes} url="/routes">
  {#each data.routes as record}
    <Route {record} />
  {/each}
</Grid>
