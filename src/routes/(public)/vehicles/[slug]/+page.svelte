<script>
  import { env } from "$env/dynamic/public";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import PageNotFound from "$lib/components/public/PageNotFound.svelte";
  import FeaturedImage from "$lib/components/public/FeaturedImage.svelte";
  import PageTitle from "$lib/components/public/single/PageTitle.svelte";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  import ImageGallery from "$lib/components/public/single/ImageGallery.svelte";
  import VehicleSpecs from "$lib/components/public/single/VehicleSpecs.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";

  export let data;

  const record = data.data;

  function getContentText(html) {
    return html.replace(/(<([^>]+)>)/gi, "").substring(0, 155) + "...";
  }
</script>

<svelte:head>
  <title>{data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`}</title>
  <meta name="description" content={data.data.meta_description || getContentText(data.data.description)} />
  <meta property="og:title" content={data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`} />
  <meta property="og:description" content={data.data.meta_description || getContentText(data.data.description)} />
  <meta property="og:image" content={`${env.PUBLIC_DB_URL}/storage/v1/object/public/contents/${data.data.image}`} />
  <link rel="canonical" href="https://australia4wdrentals.com/vehicles/{data.data.slug}" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/vehicles/${data.data.slug}",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${data.data.meta_description || getContentText(data.data.description)}",
    "email": "info@australia4wdrentals.com",
    "image": "${env.PUBLIC_DB_URL}/storage/v1/object/public/contents/${data.data.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "${data.data.meta_title || `${data.data.name} - Australia 4 Wheel Drive Rentals`}"
  }
  </script>`}
</svelte:head>

{#if !record}
  <PageNotFound />
{:else}
  <PageHeader>
    <div
      class="h-full bg-contain bg-center bg-no-repeat bg-brand-900"
      style="background-image: url('{env.PUBLIC_DB_URL}/storage/v1/object/public/contents/{data.data.image}');"
    >
      <!-- <div class="w-full h-full bg-black/50 flex flex-col items-center justify-center text-center p-10">
        <h1 class="text-4xl font-bold text-white">{data.data.name}</h1>
      </div> -->
    </div>
  </PageHeader>
  <div class="container xl:max-w-7xl mx-auto bg-white my-8 divide-y divide-gray-200">
    <section class="p-5 mb-5">
      <PageTitle
        {record}
        parent={{
          name: "Vehicles",
          url: "/vehicles",
        }}
      />
      <VehicleFeatures {record} />
    </section>
    <ImageGallery images={record.images} />
    <VehicleSpecs specs={record.specifications} />

    <section class="pt-8 bg-gray-100">
      <Tabs class="border-b-2 border-gray-200">
        {#if record.description !== "" && record.description !== null}
          <Tab label="Description" />
        {/if}
        {#if record.restrictions !== "" && record.restrictions !== null}
          <Tab label="Restrictions" />
        {/if}
        {#if record.notes !== "" && record.notes !== null}
          <Tab label="Notes" />
        {/if}
        {#if record.faqs.length > 0 && record.faqs !== null}
          <Tab label="FAQs" />
        {/if}
        <svelte:fragment slot="content">
          {#if record.description !== "" && record.description !== null}
            <TabContent class="p-5 bg-white">
              {@html record.description}
            </TabContent>
          {/if}
          {#if record.restrictions !== "" && record.restrictions !== null}
            <TabContent class="p-5 bg-white">
              {@html record.restrictions}
            </TabContent>
          {/if}
          {#if record.notes !== "" && record.notes !== null}
            <TabContent class="p-5 bg-white">
              {@html record.notes}
            </TabContent>
          {/if}
          {#if record.faqs.length > 0 && record.faqs !== null}
            <TabContent class="p-5 bg-white">
              <div class="divide-y divide-gray-200">
                {#each record.faqs as faq}
                  <div class="py-4">
                    <div class="font-bold mb-4">{faq.Title}</div>
                    <div class="mb-2">{faq.Question}</div>
                    <div class="text-gray-500">{@html faq.Answer.replace(/(?:\r\n|\r|\n)/g, "<br>")}</div>
                  </div>
                {/each}
              </div>
            </TabContent>
          {/if}
        </svelte:fragment>
      </Tabs>
    </section>
  </div>
{/if}
