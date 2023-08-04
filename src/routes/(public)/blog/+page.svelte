<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Blog from "$lib/components/public/archive/card/Blog.svelte";

  export let data;
  console.log(data);
</script>

<svelte:head>
  <title>Blog - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<Filter title="Blog" keyword={data.keyword} url="/blog" />
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.articles}
  url="/blog"
>
  {#each data.articles as record}
    <Blog {record} />
  {/each}
</Grid>
