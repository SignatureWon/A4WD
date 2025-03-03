<script>
  import { env } from "$env/dynamic/public";
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  import { Button } from "carbon-components-svelte";
  import TitleBackground from "$lib/components/public/archive/Title-background.svelte";
  export let data;

  function getContentText(html) {
    return html.replace(/(<([^>]+)>)/gi, "").substring(0, 155) + "...";
  }
</script>

<svelte:head>
  <title>{data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`}</title>
  <meta name="description" content={data.data.meta_description || getContentText(data.data.content)} />
  <meta property="og:title" content={data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`} />
  <meta property="og:description" content={data.data.meta_description || getContentText(data.data.content)} />
  <meta property="og:image" content={`${env.PUBLIC_DB_URL}/storage/v1/object/public/contents/${data.data.image}`} />
  <link rel="canonical" href="https://australia4wdrentals.com/attractions/{data.data.slug}" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/attractions/${data.data.slug}",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${data.data.meta_description || getContentText(data.data.content)}",
    "email": "info@australia4wdrentals.com",
    "image": "${env.PUBLIC_DB_URL}/storage/v1/object/public/contents/${data.data.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "${data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`}"
  }
  </script>`}
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
