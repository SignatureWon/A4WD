<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import { Button } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import TitleBackground from "$lib/components/public/archive/Title-background.svelte";
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

  let plainDesc = "";
  onMount(() => {
    plainDesc = convertToPlain(data.data.content);
  });
</script>

<svelte:head>
  <title>{data.data.name} - Destination - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={data.data.meta_description || plainDesc} />
</svelte:head>

{#if !data.data}
  <div class="px-5 py-10 container xl:max-w-7xl mx-auto bg-white rounded text-center my-8">
    <div class="h1 mb-4">No destinations found</div>
    <div><Button href="/" class="inline-block">Back to home</Button></div>
  </div>
{:else}
  <PageHeader>
    <TitleBackground title={data.data.name} image={data.data.image} />
  </PageHeader>
  <div class="p-5 container xl:max-w-7xl mx-auto bg-white rounded my-8">
    <div class="content">
      {@html data.data.content}
    </div>
    <div class="mt-6 [&>iframe]:w-full">
      {@html data.data.description}
    </div>
  </div>
{/if}
