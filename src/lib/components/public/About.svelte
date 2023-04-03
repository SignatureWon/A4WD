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
</script>

<section>
  <div class="pt-5 pb-10">
    <div class="container xl:max-w-7xl mx-auto py-10 px-5 text-center">
      <div class="text-sm font-bold tracking-wider text-brand-600">
        {title.name}
      </div>
      <h2 class="text-3xl font-medium mb-4">{title.subtitle}</h2>
      {#if title.description}
        <p class="px-2 text-base text-gray-600 leading-relaxed">
          {@html title.description}
        </p>
      {/if}
    </div>
  </div>
</section>
