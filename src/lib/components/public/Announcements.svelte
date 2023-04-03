<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";

  export let records = [];

  onMount(() => {
    new Splide(".carousel-announcements", {
      type: "loop",
      autoplay: true,
      interval: 3000,
      perPage: 1,
      arrows: false,
      pagination: false,
    }).mount();
  });
</script>

<div class="flex-1 h-8 overflow-hidden hidden lg:block">
  <section class="splide carousel-announcements">
    <div class="splide__track">
      <ul class="splide__list">
        {#each records as item}
          <li class="splide__slide">
            <div class="h-8 leading-8">
              <a href={item.content} class="block">{item.name}</a>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </section>
</div>
