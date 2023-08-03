<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Item from "$lib/components/public/archive/card/Item.svelte";
  import { onMount } from "svelte";

  export let data;

  function convertToPlain(html) {
    var tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    let result = tempDivElement.textContent || tempDivElement.innerText || "";
    if (result.length > 155) {
      result = result.substring(0, 155) + "...";
    }
    return result;
  }

  let pageTitle = {};
  let plainDesc = "";
  onMount(() => {
    plainDesc = convertToPlain(data.category.description);

    pageTitle = {
      name: data.category.name,
      subtitle: plainDesc,
    };
  });

  console.log(data);
</script>

<svelte:head>
  <title>{data.category.meta_title || `${data.category.name} - Australia 4 Wheel Drive Rentals`}</title>
  <meta name="description" content={data.category.meta_description || `${data.category.name} - ${plainDesc}`} />
</svelte:head>

<PageHeader>
  <Title {pageTitle} />
</PageHeader>
<Filter title={data.category.name} keyword={data.keyword} url="/category/{data.type}/{data.category.slug}" />
<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.list}
  url="/{data.type}"
>
  {#each data.list as record}
    <Item {record} type={data.type} />
  {/each}
</Grid>
