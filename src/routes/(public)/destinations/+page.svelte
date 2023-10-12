<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Destination from "$lib/components/public/archive/card/Destination.svelte";

  export let data;
</script>

<svelte:head>
  <title>Destinations - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:title" content="Destinations - {data.site.title}" />
  <meta property="og:description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:image" content={data.site.image} />
  <link rel="canonical" href="https://australia4wdrentals.com/destinations" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/destinations",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${`${data.pageTitle.name}. ${data.pageTitle.subtitle}`}",
    "email": "info@australia4wdrentals.com",
    "image": "${data.site.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "Destinations - ${data.site.title}"
  }
  </script>`}
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Destinations" keyword={data.keyword} url="/destinations" />
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.destinations}
  url="/destinations"
>
  {#each data.destinations as record}
    <Destination {record} />
  {/each}
</Grid>
