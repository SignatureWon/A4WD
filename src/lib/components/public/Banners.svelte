<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";

  export let records = [];

  onMount(() => {
    new Splide(".carousel-banners", {
      type: "loop",
      drag: true,
      autoplay: true,
      interval: 5000,
    }).mount();
  });
</script>

<section class="splide carousel-banners">
  <div class="splide__track">
    <ul class="splide__list">
      {#each records as item}
        <li class="splide__slide">
          <div
            class="h-[395px] bg-cover bg-center"
            style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{item.image}?width=800&height=800&resize=contain');"
          >
            <div
              class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
            >
              <div class="text-2xl font-bold text-white">{item.name}</div>
              <div class="text-brand-200 text-lg mb-4">
                {item.description}
              </div>
              {#if item.content !== null || item.content !== ""}
                <Button href={item.content}>Learn more</Button>
              {/if}
            </div>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>
