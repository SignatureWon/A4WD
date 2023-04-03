<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";

  export let records = [];

  onMount(() => {
    new Splide(".carousel-gallery", {
      type   : 'loop',
      drag   : true,
      autoplay: true,
      interval: 5000,
    }).mount();
  });
</script>

<section class="splide carousel-gallery">
  <div class="splide__track">
    <ul class="splide__list">
      {#each records as item}
        <li class="splide__slide">
          <div
            class="h-96 bg-cover bg-center"
            style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/{item.name}');"
          >
            <div
              class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
            >
              <div class="text-4xl font-bold text-white">{item.caption}</div>
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>