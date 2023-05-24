<script>
  import Banners from "$lib/components/public/Banners.svelte";
  import Vehicles from "$lib/components/public/Vehicles.svelte";
  import About from "$lib/components/public/About.svelte";
  import Testimonials from "$lib/components/public/Testimonials.svelte";
  import Faqs from "$lib/components/public/Faqs.svelte";
  import Features from "$lib/components/public/Features.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import SectionCarousel from "$lib/components/public/SectionCarousel.svelte";

  export let data;

  const getContent = (contentType) => {
    let resp = data.contents.filter(function (item) {
      return item.type === contentType;
    });
    return resp;
  };
</script>

<PageHeader>
  <Banners records={getContent("banners")} />
</PageHeader>
<SectionCarousel records={getContent("destinations")} title={data.site.destinations} button="More Destinations" />
<Vehicles record4={getContent("4WD")} record2={getContent("2WD")} title={data.site.vehicles} />
<SectionCarousel records={getContent("routes")} title={data.site.routes} button="More Routes" />
<SectionCarousel records={getContent("attractions")} title={data.site.attractions} button="More Attractions" />
<About title={data.site.about} />
<Features records={getContent("features")} title={data.site.features} />
<SectionCarousel records={getContent("articles")} title={data.site.blog} button="More Articles" content={true} />
<Testimonials records={getContent("testimonials")} title={data.site.testimonials} />
<Faqs records={getContent("faqs")} title={data.site.faqs} />