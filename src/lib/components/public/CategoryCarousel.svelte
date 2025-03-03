<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";

  export let title = {
    type: "",
    name: "",
    subtitle: "",
    description: "",
  };
  export let records = [];
  export let button = "button";
  export let content = false;

  const perPage = {
    desktop: records.options.length > 4 ? 4 : records.options.length,
    tablet: records.options.length > 3 ? 3 : records.options.length,
    mobile: records.options.length > 2 ? 2 : records.options.length,
  };

  onMount(() => {
    new Splide(`.carousel-${title.type}`, {
      type: "loop",
      // arrows: false,
      drag: true,
      autoplay: true,
      interval: 5000,
      pagination: false,
      perPage: perPage.desktop,
      breakpoints: {
        640: {
          perPage: perPage.mobile,
        },
        1024: {
          perPage: perPage.tablet,
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
        <h2 class="text-xl font-extrabold mb-2">{title.subtitle}</h2>
        {#if title.description}
          <p class="mb-4 leading-relaxed text-gray-600">
            {@html title.description}
          </p>
        {/if}
      </div>
      <div class="text-center hidden md:block pl-8 pb-8">
        <Button href="/{title.type}" class="inline-block">{button}</Button>
      </div>
    </div>
    <section class="splide carousel-{title.type} -mx-10">
      <div class="splide__track mx-10">
        <ul class="splide__list">
          {#each records.options as item, itemIndex}
            {#if itemIndex <= 10}
              <li class="splide__slide">
                <div class="px-2 group">
                  <a href="/category/{title.type}/{item.slug}">
                    <div class="h-44 overflow-hidden rounded relative flex items-center">
                      {#if item.image}
                        <!-- {#await preload(`${env.PUBLIC_DB_URL}/storage/v1/object/public/contents/${item.image}`) then base64} -->
                        <!-- style="background-image: url('{env.PUBLIC_DB_URL}/storage/v1/render/image/public/contents/{item.image}?width=300&height=300&resize=contain');" -->
                        <div class="bg-cover bg-center blur-md absolute w-full h-full scale-110 -z-10" />
                        <img
                          src="{env.PUBLIC_DB_URL}/storage/v1/render/image/public/contents/{item.image}?width=300&height=300&resize=contain"
                          alt={item.name}
                          width="300"
                          height="300"
                          class="transition-all group-hover:scale-125"
                        />
                        <!-- {/await} -->
                      {:else}
                        <div class="absolute w-full h-full bg-gray-200" />
                      {/if}
                    </div>
                    <div class="text-lg font-medium py-2 bg-white truncate h-10">
                      {item.name}
                    </div>
                    <span class="text-brand-500 text-sm">View {title.type}</span>
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
      <Button href="/{title.type}" class="inline-block">{button}</Button>
    </div>
  </div>
</section>
