<script>
  import { env } from "$env/dynamic/public";
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import { Button } from "carbon-components-svelte";
  import { onMount } from "svelte";
  export let data;
  console.log(data);

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
  <title>{data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`}</title>
  <meta name="description" content={data.data.meta_description || plainDesc} />
</svelte:head>

{#if !data.data}
  <div class="px-5 py-10 container xl:max-w-7xl mx-auto bg-white rounded text-center my-8">
    <div class="h1 mb-4">No pages found</div>
    <div><Button href="/" class="inline-block">Back to home</Button></div>
  </div>
{:else}
  <PageHeader>
    <div
      class="h-full bg-cover bg-center"
      style={data.data.image
        ? `background-image: url('${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/${data.data.image}');`
        : ""}
    >
      <div class="w-full h-full bg-black/50 flex flex-col items-center justify-center text-center p-10">
        <h1 class="text-4xl font-bold text-white">{data.data.name}</h1>
      </div>
    </div>
  </PageHeader>
  <div class="p-5 container xl:max-w-7xl mx-auto bg-white rounded my-8">
    <div class="content mb-8">
      {@html data.data.content}
    </div>
    {#if data.data.attachment}
      <embed src={`${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/terms/${data.data.attachment}`} type="application/pdf" width="100%" height="1200" />
    {/if}
  </div>
{/if}
