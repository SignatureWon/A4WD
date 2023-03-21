<script>
  import Carousel from "svelte-carousel";
  import { browser } from "$app/environment";
  export let records = [];

  let carousel;

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

<div class="bg-brand-50">
  <div class="space-y-8 container xl:max-w-7xl mx-auto px-4 py-16">
    <!-- Heading -->
    <div class="text-center">
      <div
        class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
      >
        Testimonials
      </div>
      <h2
        class="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center"
      >
        Our customers love us
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="text-red-600 w-8 h-8 ml-2"
          fill="currentColor"
          ><path fill="none" d="M0 0H24V24H0z" /><path
            d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"
          /></svg
        >
      </h2>
    </div>
    <!-- END Heading -->

    {#if browser}
      <Carousel
        let:showPrevPage
        let:showNextPage
        dots={false}
        particlesToShow={slide}
        bind:this={carousel}
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          <div class="group flex flex-col p-5 relative bg-white rounded-xl mx-4">
            <div class="absolute top-0 right-0 text-7xl mt-3 mr-4 text-gray-200 opacity-75 font-serif">
              “
            </div>
            <blockquote class="grow flex flex-col relative">
              <div class="mb-6">
                <div
                  class="inline-flex items-center text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-lg transition ease-out origin-top-left group-hover:scale-110"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="hi-solid hi-star inline-block w-5 h-5"
                    ><path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    /></svg
                  >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="hi-solid hi-star inline-block w-5 h-5"
                    ><path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    /></svg
                  >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="hi-solid hi-star inline-block w-5 h-5"
                    ><path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    /></svg
                  >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="hi-solid hi-star inline-block w-5 h-5"
                    ><path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    /></svg
                  >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    class="hi-solid hi-star inline-block w-5 h-5"
                    ><path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    /></svg
                  >
                </div>
              </div>
              <p
                class="grow text-sm text-gray-700 font-medium leading-relaxed mb-5"
              >
                {item.content}
              </p>
              <footer>
                <div class="font-semibold text-brand-600 hover:text-brand-400">
                  {item.name}
                </div>
                <div class="text-gray-400 text-sm">
                  {item.description}
                </div>
              </footer>
            </blockquote>
          </div>
        {/each}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    {/if}
  </div>
</div>
