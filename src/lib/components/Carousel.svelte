<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { Button, ButtonSet } from "carbon-components-svelte";

  export let name = "name";
  export let records = [];

  onMount(() => {
    new Splide(".carousel-articles", {
      type: "loop",
      // arrows: false,
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
      classes: {
        arrows: "splide__arrows your-class-arrows",
        arrow: "splide__arrow your-class-arrow",
        prev: "splide__arrow--prev your-class-prev",
        next: "splide__arrow--next your-class-next",
      },
    }).mount();
  });
</script>

<section class="splide carousel-articles -mx-10">
  <div class="splide__track mx-10">
    <ul class="splide__list">
      {#each records as item, itemIndex}
        {#if itemIndex <= 10}
          <li class="splide__slide">
            <div class="px-2 group">
              <a href="/blog/{item.slug}">
                <div class="h-44 overflow-hidden rounded relative flex items-center">
                  <div
                    class="bg-cover bg-center blur-md absolute w-full h-full scale-110 -z-10"
                    style="background-image: url('{env.PUBLIC_URL}/storage/v1/object/public/contents/{item.image}');"
                  />
                  <img
                    src="{env.PUBLIC_URL}/storage/v1/object/public/contents/{item.image}"
                    alt={item.name}
                    class="z-10"
                  />
                </div>
                <div class="text-lg font-medium py-2 bg-white">
                  {item.name}
                </div>
                <div class="text-gray-500">
                  {@html item.content}
                  <span class="text-brand-500">Read more</span>
                </div>
              </a>
            </div>
          </li>
        {/if}
      {/each}
    </ul>
  </div>
</section>
<div />
<div class="text-center md:hidden pt-8">
  <Button href="/blog" class="inline-block">More articles</Button>
</div>
