<script>
  import Banners from "$lib/components/public/Banners.svelte";
  import Vehicles from "$lib/components/public/Vehicles.svelte";
  import About from "$lib/components/public/About.svelte";
  import Testimonials from "$lib/components/public/Testimonials.svelte";
  import Faqs from "$lib/components/public/Faqs.svelte";
  import Features from "$lib/components/public/Features.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import SectionCarousel from "$lib/components/public/SectionCarousel.svelte";
  import ContactForm from "$lib/components/public/ContactForm.svelte";

  export let data;
  console.log(data);

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
</svelte:head>

<PageHeader>
  <Banners records={getContent("banners")} />
</PageHeader>
<SectionCarousel records={getContent("destinations")} title={data.sections.destinations} button="More Destinations" />
<Vehicles record4={getContent("4WD")} record2={getContent("2WD")} title={data.sections.vehicles} />
<SectionCarousel records={getContent("specials")} title={data.sections.specials} button="More Specials" />
<SectionCarousel records={getContent("routes")} title={data.sections.routes} button="More Routes" />
<SectionCarousel records={getContent("attractions")} title={data.sections.attractions} button="More Attractions" />
<SectionCarousel records={getContent("events")} title={data.sections.events} button="More Events" />
<About title={data.sections.about} />
<Features records={getContent("features")} title={data.sections.features} />
<SectionCarousel records={getContent("articles")} title={data.sections.blog} button="More Articles" content={true} />
<Testimonials records={getContent("testimonials")} title={data.sections.testimonials} />
<Faqs records={getContent("faqs")} title={data.sections.faqs} />
<ContactForm content={data.sections.contact} />