<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Attraction from "$lib/components/public/archive/card/Attraction.svelte";

  export let data;
</script>

<svelte:head>
  <title>Attractions - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Attractions" keyword={data.keyword} url="/attractions" />
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.attractions}
  url="/attractions"
>
  {#each data.attractions as record}
    <Attraction {record} />
  {/each}
</Grid>
