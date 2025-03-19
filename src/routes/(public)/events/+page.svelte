<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Event from "$lib/components/public/archive/card/Event.svelte";

  export let data;
</script>

<svelte:head>
  <title>Events - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:title" content="Events - {data.site.title}" />
  <meta property="og:description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:image" content={data.site.image} />
  <link rel="canonical" href="https://australia4wdrentals.com/events" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/events",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${`${data.pageTitle.name}. ${data.pageTitle.subtitle}`}",
    "email": "info@australia4wdrentals.com.au",
    "image": "${data.site.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "Events - ${data.site.title}"
  }
  </script>`}
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Events" keyword={data.keyword} url="/events" />
<Grid page={data.pageCurrent} total={data.pageTotal} keyword={data.keyword} records={data.events} url="/events">
  {#each data.events as record}
    <Event {record} />
  {/each}
</Grid>
