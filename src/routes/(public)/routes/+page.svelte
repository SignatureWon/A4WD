<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Event from "$lib/components/public/archive/card/Event.svelte";

  export let data;
</script>

<svelte:head>
  <title>Routes - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Routes" keyword={data.keyword} url="/routes" />
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.routes}
  url="/routes"
>
  {#each data.routes as record}
    <Event {record} />
  {/each}
</Grid>
