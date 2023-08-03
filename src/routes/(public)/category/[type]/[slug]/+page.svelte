<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import Grid from "$lib/components/public/archive/Grid.svelte";
  import { env } from "$env/dynamic/public";
  // import Title from "$lib/components/public/archive/Title.svelte";
  import Filter from "$lib/components/public/archive/Filter.svelte";
  import Item from "$lib/components/public/archive/card/Item.svelte";
  import { onMount } from "svelte";

  export let data;

  function convertToPlain(html) {
    var tempDivElement = document.createElement("div");
    tempDivElement.innerHTML = html;
    let result = tempDivElement.textContent || tempDivElement.innerText || "";
    if (result.length > 160) {
      result = result.substring(0, 160) + "...";
    }
    return result;
  }
  let show = false;
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
  <div
    class="h-full bg-cover bg-center"
    style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{data.category.image}');"
  >
    <div class="w-full h-full bg-black/50 flex flex-col items-center justify-center text-center p-10">
      <h1 class="text-4xl font-bold text-white mb-4">{data.category.name}</h1>
    </div>
  </div>
  <!-- <Title {pageTitle} /> -->
</PageHeader>
<Filter title={data.category.name} keyword={data.keyword} url="/category/{data.type}/{data.category.slug}" />
{#if data.category.description}
  <div class="p-5 container xl:max-w-7xl mx-auto bg-white rounded mt-5">
    <div class="content overflow-hidden {show ? '' : 'h-12'}">
      {@html data.category.description}
    </div>
    <div class="mt-2">
      <a
        class="text-sm text-gray-400 cursor-pointer"
        on:click={() => {
          show = !show;
        }}>{show ? "Read less" : "Read more"}</a
      >
    </div>
  </div>
{/if}

<Grid
  page={data.pageCurrent}
  total={data.pageTotal}
  keyword={data.keyword}
  records={data.list}
  url="/category/{data.type}/{data.category.slug}"
>
  {#each data.list as record}
    <Item {record} type={data.type} />
  {/each}
</Grid>
