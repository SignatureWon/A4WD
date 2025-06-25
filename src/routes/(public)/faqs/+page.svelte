<script>
  import PageHeader from "$lib/components/public/PageHeader-reverse.svelte";
  // import Grid from "$lib/components/public/archive/Grid.svelte";
  import Title from "$lib/components/public/archive/Title.svelte";
  // import Filter from "$lib/components/public/archive/Filter.svelte";
  // import Event from "$lib/components/public/archive/card/Event.svelte";
  import { Accordion, AccordionItem } from "carbon-components-svelte";

  export let data;
</script>

<svelte:head>
  <title>FAQs - Australia 4 Wheel Drive Rentals</title>
  <meta name="description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:title" content="FAQs - {data.site.title}" />
  <meta property="og:description" content={`${data.pageTitle.name}. ${data.pageTitle.subtitle}`} />
  <meta property="og:image" content={data.site.image} />
  <link rel="canonical" href="https://australia4wdrentals.com/faqs" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com/faqs",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${`${data.pageTitle.name}. ${data.pageTitle.subtitle}`}",
    "email": "info@australia4wdrentals.com.au",
    "image": "${data.site.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "FAQs - ${data.site.title}"
  }
  </script>`}
</svelte:head>

<PageHeader>
  <Title pageTitle={data.pageTitle} />
</PageHeader>

<div class="space-y-8 lg:w-3/5 lg:flex-none mx-auto py-16">
  <Accordion>
    {#each data.faqs as item}
      <AccordionItem title={item.name}>
        <div class="text-gray-500 p-5">{item.description}</div>
      </AccordionItem>
    {/each}
  </Accordion>
</div>
