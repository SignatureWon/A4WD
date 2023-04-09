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
  export let record4 = [];
  export let record2 = [];

  onMount(() => {
    new Splide(".carousel-2wd", {
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
    new Splide(".carousel-4wd", {
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

<section class="pt-5 pb-10 bg-gray-100">
  <div class="container xl:max-w-7xl mx-auto p-5">
    <div class="md:flex items-end">
      <div class="flex-1">
        <div class="text-sm font-bold tracking-wider text-brand-600">
          {title.name}
        </div>
        <h2 class="text-xl font-extrabold mb-4">{title.subtitle}</h2>
        {#if title.description}
          <p class="mb-8 px-2 leading-relaxed text-gray-600">
            {@html title.description}
          </p>
        {/if}
      </div>
      <div class="text-center hidden md:block pl-8 pb-8">
        <Button href="/vehicles" class="inline-block">More Vehicles</Button>
      </div>
    </div>
    <div class="rounded bg-white p-4">
      <div class="mb-4 font-bold text-center">4WD Vehicles</div>
      <section class="splide carousel-4wd">
        <div class="splide__track">
          <ul class="splide__list">
            {#each record4 as item, itemIndex}
              {#if itemIndex <= 10}
                <li class="splide__slide">
                  <div class="px-2 group">
                    <a href="/vehicles/{item.slug}">
                      <div class="h-40 overflow-hidden rounded relative">
                        <div
                          class="text-lg font-medium px-2 bg-white inline-block absolute bottom-0 z-10"
                        >
                          {item.name}
                        </div>
                        <div
                          class="h-40 bg-cover bg-center transition-all group-hover:scale-125 bg-gray-200"
                          style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{item.image}');"
                        />
                      </div>
                    </a>
                  </div>
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      </section>
    </div>
    <div class="rounded bg-white p-4">
      <div class="mb-4 font-bold text-center">2WD Vehicles</div>
      <section class="splide carousel-2wd">
        <div class="splide__track">
          <ul class="splide__list">
            {#each record2 as item, itemIndex}
              {#if itemIndex <= 10}
                <li class="splide__slide">
                  <div class="px-2 group">
                    <a href="/vehicles/{item.slug}">
                      <div class="h-40 overflow-hidden rounded relative">
                        <div
                          class="text-lg font-medium px-2 bg-white inline-block absolute bottom-0 z-10"
                        >
                          {item.name}
                        </div>
                        <div
                          class="h-40 bg-cover bg-center transition-all group-hover:scale-125 bg-gray-200"
                          style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{item.image}');"
                        />
                      </div>
                    </a>
                  </div>
                </li>
              {/if}
            {/each}
          </ul>
        </div>
      </section>
    </div>
    <div class="text-center md:hidden pt-8">
      <Button href="/vehicles" class="inline-block">More Vehicles</Button>
    </div>
  </div>
</section>
