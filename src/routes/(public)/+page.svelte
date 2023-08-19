<script>
  import Banners from "$lib/components/public/Banners.svelte";
  import Vehicles from "$lib/components/public/Vehicles.svelte";
  import About from "$lib/components/public/About.svelte";
  import Testimonials from "$lib/components/public/Testimonials.svelte";
  import Faqs from "$lib/components/public/Faqs.svelte";
  import Features from "$lib/components/public/Features.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import SectionCarousel from "$lib/components/public/SectionCarousel.svelte";
  import CategoryCarousel from "$lib/components/public/CategoryCarousel.svelte";
  import ContactForm from "$lib/components/public/ContactForm.svelte";

  export let data;
  // console.log(data);

  const getContent = (contentType) => {
    let resp = data.contents.filter(function (item) {
      return item.type === contentType;
    });
    return resp;
  };
</script>

<svelte:head>
  <title>{data.site.title}</title>
  <meta name="description" content={data.site.description} />
  <meta property="og:title" content={data.site.title} />
  <meta property="og:description" content={data.site.description} />
  <meta property="og:image" content={data.site.image} />
  <link rel="canonical" href="https://australia4wdrentals.com" />
  {@html `<script type="application/ld+json" class="schemantra">
  {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": "TravelAgency",
    "url": "https://australia4wdrentals.com",
    "telephone": "1800107371",
    "tourBookingPage": "https://australia4wdrentals.com/search",
    "description": "${data.site.description}",
    "email": "info@australia4wdrentals.com",
    "image": "${data.site.image}",
    "location": "Australia",
    "logo": "https://api.australia4wdrentals.com/storage/v1/render/image/public/contents/${data.site.logo}",
    "name": "${data.site.title}"
  }
  </script>`}
</svelte:head>

<PageHeader>
  <Banners records={getContent("banners")} />
</PageHeader>
{#if data.site.h1}
  <div class="bg-white">
    <div class="pt-8 px-4 container xl:max-w-7xl mx-auto">
      <h1 class="h1">{data.site.h1}</h1>
    </div>
  </div>
{/if}
<SectionCarousel records={getContent("destinations")} title={data.sections.destinations} button="More Destinations" />
<Vehicles record4={getContent("4WD")} record2={getContent("2WD")} title={data.sections.vehicles} />
<SectionCarousel records={getContent("specials")} title={data.sections.specials} button="More Specials" />
<CategoryCarousel records={data.states[1]} title={data.sections.routes} button="More Routes" />
<CategoryCarousel records={data.states[0]} title={data.sections.attractions} button="More Attractions" />
<CategoryCarousel records={data.states[2]} title={data.sections.events} button="More Events" />
<!-- <SectionCarousel records={getContent("attractions")} categories={data.states} title={data.sections.attractions} button="More Attractions" />
<SectionCarousel records={getContent("events")} categories={data.states} title={data.sections.events} button="More Events" /> -->
<About title={data.sections.about} />
<Features records={getContent("features")} title={data.sections.features} />
<SectionCarousel records={getContent("articles")} title={data.sections.blog} button="More Articles" content={true} />
<Testimonials records={getContent("testimonials")} title={data.sections.testimonials} />
<Faqs records={getContent("faqs")} title={data.sections.faqs} />
<ContactForm content={data.sections.contact} />
