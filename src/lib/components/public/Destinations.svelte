<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";

  export let records = [];

  onMount(() => {
    new Splide(".carousel-destinations", {
      type   : 'loop',
      drag   : true,
      autoplay: true,
      interval: 5000,
      perPage: 4,
      breakpoints: {
        640: {
          perPage: 2,
        },
        1024: {
          perPage: 3,
        },
      }
    }).mount();
  });
</script>

<section class="pt-5 pb-10 bg-white">
  <div class="max-w-6xl mx-auto p-5">
    <div class="text-sm font-bold tracking-wider text-brand-600">Popular</div>
    <h2 class="text-3xl font-medium">Destinations</h2>
  </div>
  <section class="splide carousel-destinations">
    <div class="splide__track">
      <ul class="splide__list">
        {#each records as item}
          <li class="splide__slide">
            <div class="px-2 group">
              <a href="#">
                <div class="h-40 overflow-hidden rounded">
                  <div
                    class="h-40 bg-cover bg-center transition-all group-hover:scale-125"
                    style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{item.image}');"
                  />
                </div>
                <div
                  class="text-lg font-medium px-2 h-8 leading-8 -mt-8 bg-white inline-block absolute"
                >
                  {item.name}
                </div>
              </a>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</section>
