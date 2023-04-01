<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";

  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };
  export let records = [];

  onMount(() => {
    new Splide(".carousel-destinations", {
      type: "loop",
      drag: true,
      autoplay: true,
      interval: 5000,
      pagination: false,
      perPage: 4,
      breakpoints: {
        640: {
          perPage: 2,
        },
        1024: {
          perPage: 3,
        },
      },
    }).mount();
  });
</script>

<section class="pt-5 pb-10 bg-white">
  <div class="max-w-7xl mx-auto p-5">
    <div class="text-sm font-bold tracking-wider text-brand-600">
      {title.name}
    </div>
    <h2 class="text-3xl font-medium mb-4">{title.subtitle}</h2>
    {#if title.description}
      <p
        class="mb-4 text-lg md:text-xl md:leading-relaxed font-medium text-gray-600"
      >
        {@html title.description}
      </p>
    {/if}
    <section class="splide carousel-destinations">
      <div class="splide__track">
        <ul class="splide__list">
          {#each records as item, itemIndex}
            {#if itemIndex <= 10}
              <li class="splide__slide">
                <div class="px-2 group">
                  <a href="/destinations/{item.slug}">
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
            {/if}
          {/each}
        </ul>
      </div>
    </section>
    <div class="text-center pt-8">
      <Button href="/destinations" class="inline-block">More Destinations</Button>
    </div>
  </div>
</section>
