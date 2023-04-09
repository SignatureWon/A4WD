<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";

  export let images = [];

  let splide;

  onMount(() => {
    splide = new Splide(".carousel-gallery", {
      type: "loop",
      drag: true,
      autoplay: true,
      interval: 5000,
      pagination: false,
    }).mount();
  });
</script>

<section class="p-5 mb-5">
  <h2 class="text-xl font-bold mb-4">Gallery</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div
      class="splide carousel-gallery border border-gray-200 bg-gray-100"
      aria-label="My Awesome Gallery"
    >
      <div class="splide__track">
        <ul class="splide__list">
          {#each images as img}
            <li class="splide__slide">
              <img
                src={img.url}
                alt={img.caption}
                class="h-80 object-contain"
              />
            </li>
          {/each}
        </ul>
      </div>
    </div>
    <div>
      <div class="grid grid-cols-3 lg:grid-cols-4 gap-1 items-start">
        {#each images as img, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div on:click={() => splide.go(index)}>
            <img src={img.thumb} alt={img.caption} class="h-20 w-full object-cover" />
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
