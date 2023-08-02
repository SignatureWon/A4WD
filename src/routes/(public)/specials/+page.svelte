<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Special from "$lib/components/public/archive/card/Special.svelte";

  export let data;
</script>

<svelte:head>
  <title>Specials - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Specials" keyword={data.keyword} url="/specials" />
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.specials}
  url="/specials"
>
  {#each data.specials as record}
    <Special {record} />
  {/each}
</Grid>
