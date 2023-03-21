<script>
  // import Carousel from "svelte-carousel";
  import { browser } from "$app/environment";
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";
  let carousel; // for calling methods of the carousel instance

  export const records = [];
</script>

<!-- {#if browser}
  <Carousel
    let:showPrevPage
    let:showNextPage
    autoplay
    autoplayDuration={5000}
    dots={false}
    pauseOnFocus={true}
    bind:this={carousel}
  >
    <div
      slot="prev"
      on:click={showPrevPage}
      class="absolute top-0 left-0 h-full z-10 flex items-center text-white opacity-50 hover:opacity-100"
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
      <div
        class="h-96 bg-cover bg-center"
        style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{item.image}');"
      >
        <div
          class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
        >
          <div class="text-4xl font-bold text-white">{item.name}</div>
          <div class="text-brand-200 text-2xl mb-4">
            {item.description}
          </div>
          {#if item.content !== null || item.content !== ""}
          <Button href={item.content}>Learn more</Button>
          {/if}
        </div>
      </div>
    {/each}
    <div
      slot="next"
      on:click={showNextPage}
      class="absolute top-0 right-0 h-full z-10 flex items-center text-white opacity-50 hover:opacity-100"
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
