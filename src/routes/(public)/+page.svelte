<script>
  // import SearchForm from "$lib/components/public/SearchForm.svelte";
  import Banners from "$lib/components/public/Banners.svelte";
  import Destinations from "$lib/components/public/Destinations.svelte";
  import Vehicles from "$lib/components/public/Vehicles.svelte";
  import TravelRoutes from "$lib/components/public/TravelRoutes.svelte";
  import Attractions from "$lib/components/public/Attractions.svelte";
  import About from "$lib/components/public/About.svelte";
  import Testimonials from "$lib/components/public/Testimonials.svelte";
  import Faqs from "$lib/components/public/Faqs.svelte";
  import LatestArticles from "$lib/components/public/LatestArticles.svelte";
  import Features from "$lib/components/public/Features.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";

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

<Destinations records={getContent("destinations")} title={data.site.destinations} />
<Vehicles record4={getContent("4WD")} record2={getContent("2WD")} title={data.site.vehicles} />
<TravelRoutes records={getContent("routes")} title={data.site.routes} />
<Attractions records={getContent("attractions")} title={data.site.attractions} />
<About title={data.site.about} />
<Features records={getContent("features")} title={data.site.features} />
<LatestArticles records={getContent("articles")} title={data.site.blog} />
<Testimonials records={getContent("testimonials")} title={data.site.testimonials} />
<Faqs records={getContent("faqs")} title={data.site.faqs} />