<script>
  // import Carousel from "svelte-carousel";
  import { browser } from "$app/environment";
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";
  let carousel; // for calling methods of the carousel instance

  export const records = [];

  let innerWidth = 0;
  let slide = 1;
  $: {
    if (innerWidth > 640) {
      slide = 2;
      if (innerWidth > 768) {
        slide = 3;
        if (innerWidth > 1024) {
          slide = 4;
        }
      }
    } else {
      slide = 1;
    }
  }
</script>

<svelte:window bind:innerWidth />
<section class="pt-5 pb-10 bg-white">
  <div class="max-w-6xl mx-auto p-5">
    <div class="text-sm font-bold tracking-wider text-brand-600">Popular</div>
    <h2 class="text-3xl font-medium">Destinations</h2>
  </div>
  <!-- {#if browser}
    <Carousel
      let:showPrevPage
      let:showNextPage
      dots={false}
      particlesToShow={slide}
      bind:this={carousel}
    >
      <div
        slot="prev"
        on:click={showPrevPage}
        class="h-40 z-10 flex items-center text-gray-800 opacity-50 hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-8 h-8"
          fill="currentColor"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"
          /></svg
        >
      </div>
      {#each records as item}
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
      {/each}
      <div
        slot="next"
        on:click={showNextPage}
        class="h-40 z-10 flex items-center text-gray-800 opacity-50 hover:opacity-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-8 h-8"
          fill="currentColor"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"
          /></svg
        >
      </div>
    </Carousel>
  {/if} -->
</section>
