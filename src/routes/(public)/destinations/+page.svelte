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
