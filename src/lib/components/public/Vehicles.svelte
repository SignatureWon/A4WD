<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { Button, ImageLoader } from "carbon-components-svelte";

  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };
  export let record4 = [];
  export let record2 = [];

  // const preload = async (src) => {
  //   const resp = await fetch(src);
  //   const blob = await resp.blob();
  //   let img =
  //     "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  //   if (blob.type !== "application/json") {
  //     img = await new Promise(function (resolve) {
  //       let reader = new FileReader();
  //       reader.readAsDataURL(blob);
  //       reader.onload = () => {
  //         resolve(reader.result);
  //       };
  //     });
  //   }
  //   return img;
  // };

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

<section class="pt-5 pb-10 bg-white">
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
        <Button href="/vehicles" class="inline-block">See All Vehicles</Button>
      </div>
    </div>
    <div class="rounded bg-white p-4">
      <div class="mb-4">
        <span class="font-bold">4WD Car and 4WD Camper Hire</span>
        <Button kind="tertiary" href="/vehicles?category=4wd-campers" class="text-sm border-2 font-bold px-2 py-1 ml-2"
          >View All 4WD</Button
        >
      </div>
      <section class="splide carousel-4wd -mx-10">
        <div class="splide__track mx-10">
          <ul class="splide__list">
            {#each record4 as item, itemIndex}
              {#if itemIndex <= 10}
                <li class="splide__slide">
                  <div class="px-2 group">
                    <a href="/vehicles/{item.slug}">
                      <div class="h-44 overflow-hidden rounded relative flex items-center">
                        {#if item.image}
                          <!-- {#await preload(`${env.PUBLIC_URL}/storage/v1/object/public/contents/${item.image}`) then base64} -->
                          <div class="absolute w-full h-full scale-110 -z-10 bg-white border border-gray-200" />
                          <ImageLoader
                            src="{env.PUBLIC_URL}/storage/v1/render/image/public/contents/{item.image}?width=300&height=300&resize=contain"
                            alt={item.name}
                            width="300"
                            height="300"
                            class="transition-all group-hover:scale-125"
                          >
                            <!-- <svelte:fragment slot="error">An error occurred.</svelte:fragment> -->
                          </ImageLoader>
                          <!-- <img
                            src="{env.PUBLIC_URL}/storage/v1/render/image/public/contents/{item.image}?width=300&height=300&resize=contain"
                            alt={item.name}
                            width="300"
                            height="300"
                            class="transition-all group-hover:scale-125"
                          /> -->
                          <!-- {/await} -->
                        {:else}
                          <div class="absolute w-full h-full bg-gray-200" />
                        {/if}
                      </div>
                      <div class="text-lg font-medium py-2 bg-white">
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
    </div>
    <div class="rounded bg-white p-4">
      <div class="mb-4">
        <span class="font-bold">2WD Camper RV Hire</span>
        <Button kind="tertiary" href="/vehicles?category=2wd-campers" class="text-sm border-2 font-bold px-2 py-1 ml-2"
          >View All 2WD</Button
        >
      </div>
      <section class="splide carousel-2wd -mx-10">
        <div class="splide__track mx-10">
          <ul class="splide__list">
            {#each record2 as item, itemIndex}
              {#if itemIndex <= 10}
                <li class="splide__slide">
                  <div class="px-2 group">
                    <a href="/vehicles/{item.slug}">
                      <div class="h-44 overflow-hidden rounded relative flex items-center">
                        {#if item.image}
                          <!-- {#await preload(`${env.PUBLIC_URL}/storage/v1/object/public/contents/${item.image}`) then base64} -->
                          <div class="absolute w-full h-full scale-110 -z-10 bg-white border border-gray-200" />
                          <ImageLoader
                            src="{env.PUBLIC_URL}/storage/v1/render/image/public/contents/{item.image}?width=300&height=300&resize=contain"
                            alt={item.name}
                            width="300"
                            height="300"
                            class="transition-all group-hover:scale-125"
                          >
                            <!-- <svelte:fragment slot="error">An error occurred.</svelte:fragment> -->
                          </ImageLoader>
                          <!-- <img
                            src="{env.PUBLIC_URL}/storage/v1/render/image/public/contents/{item.image}?width=300&height=300&resize=contain"
                            alt={item.name}
                            width="300"
                            height="300"
                            class="transition-all group-hover:scale-125"
                          /> -->
                          <!-- {/await} -->
                        {:else}
                          <div class="absolute w-full h-full bg-gray-200" />
                        {/if}
                      </div>
                      <div class="text-lg font-medium py-2 bg-white">
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
    </div>
    <div class="text-center md:hidden pt-8">
      <Button href="/vehicles" class="inline-block">More Vehicles</Button>
    </div>
  </div>
</section>
