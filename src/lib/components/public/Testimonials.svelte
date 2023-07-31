<script>
  import "@splidejs/splide/css";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";

  export let records = [];
  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };
  let show = [false, false, false, false, false];

  onMount(() => {
    new Splide(".carousel-testimonials", {
      type: "loop",
      drag: true,
      autoplay: true,
      interval: 5000,
      perPage: 3,
      breakpoints: {
        640: {
          perPage: 1,
        },
        1024: {
          perPage: 2,
        },
      },
    }).mount();
  });
</script>

<div class="bg-brand-50">
  <div class="space-y-8 container xl:max-w-7xl mx-auto px-4 py-16">
    <div class="text-center">
      <div class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600">
        {title.name}
      </div>
      <h2 class="text-xl font-extrabold mb-4 flex items-center justify-center">
        {title.subtitle}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="text-red-600 w-6 h-6 ml-2"
          fill="currentColor"
          ><path fill="none" d="M0 0H24V24H0z" /><path
            d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"
          /></svg
        >
      </h2>
      {#if title.description}
        <p class="mb-8 leading-relaxed text-gray-600">
          {@html title.description}
        </p>
      {/if}
    </div>

    <section class="splide carousel-testimonials -mx-10">
      <div class="splide__track mx-10">
        <ul class="splide__list">
          {#each records as item, itemIndex}
            {#if itemIndex < 10}
              <li class="splide__slide">
                <div class="group flex flex-col p-5 relative bg-white rounded-xl mx-4">
                  <div class="absolute top-0 right-0 text-7xl mt-3 mr-4 text-gray-200 opacity-75 font-serif">“</div>
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
                    <div
                      class="grow text-sm text-gray-700 font-medium leading-relaxed overflow-hidden {show[
                        itemIndex
                      ]
                        ? ''
                        : 'h-24'}"
                    >
                      {item.content}
                    </div>
                    <div class="mb-5">
                      <a class="text-sm text-gray-400 cursor-pointer" on:click={() => {
                        show[itemIndex] = !show[itemIndex]
                      }}>{show[itemIndex] ? "Read less" : "Read more"}</a>
                    </div>
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
              </li>
            {/if}
          {/each}
        </ul>
      </div>
    </section>
  </div>
</div>
