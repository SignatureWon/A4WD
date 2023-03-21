<script>
  import SearchForm from "$lib/components/public/SearchForm.svelte";
  import Carousel from "svelte-carousel";
  import { browser } from "$app/environment";
  import { env } from "$env/dynamic/public";
  import { Button, Tab, TabContent, Tabs } from "carbon-components-svelte";
  let carousel; // for calling methods of the carousel instance

  let records = [
    {
      image: "068128de-4238-4b60-a683-a102659b8e0b.jpg",
      caption: "Image 1 caption",
    },
    {
      image: "vehicles-2b25d7e9-74df-4986-b578-78535c9034e5.jpg",
      caption: "Image 2 caption",
    },
    {
      image: "vehicles-b7326230-1235-48ac-89c0-57ddbb35c0f8.jpg",
      caption: "Image 3 caption",
    },
  ];
</script>

<section class="bg-brand-600 p-5">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <SearchForm />

      <div
        class="col-span-2 bg-cover bg-center bg-no-repeat"
        style="background-image: url('https://rixauffklvvhkfkwrpme.supabase.co/storage/v1/object/public/gallery/vehicles-2b25d7e9-74df-4986-b578-78535c9034e5.jpg');"
      >
        <div
          class="flex items-center justify-center w-full h-full text-white bg-black/20 p-5"
        >
          <h2 class="text-4xl font-bold">Apollo Adventure Camper</h2>
        </div>
      </div>
    </div>
  </div>
</section>
<section class="bg-white px-4">
  <div class="py-10 max-w-3xl mx-auto">
    <p class="text-xl mb-8">
      The compact Adventure Camper is perfect for those interested in a real
      outback adventure. Roomier, more fuel capacity and cooking facilities make
      this 4WD campervan ideal for thrill seeking couples.
    </p>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-2">
      <div class="flex items-center">
        <div class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="currentColor"
            ><path
              d="M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z"
            /></svg
          >
        </div>
        <div class="flex-1">4 Bed</div>
      </div>
      <div class="flex items-center">
        <div class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="currentColor"
            ><path
              d="M19.66 9.64L19.3 8.7L21.16 8C20.24 5.88 18.6 4.18 16.54 3.14L15.74 4.92L14.82 4.5L15.62 2.7C14.5 2.26 13.28 2 12 2C10.94 2 9.92 2.22 8.96 2.5L9.64 4.34L8.7 4.7L8 2.84C5.88 3.76 4.18 5.4 3.14 7.46L4.92 8.26L4.5 9.18L2.7 8.38C2.26 9.5 2 10.72 2 12C2 13.06 2.22 14.08 2.5 15.04L4.34 14.36L4.7 15.3L2.84 16C3.76 18.12 5.4 19.82 7.46 20.86L8.26 19.08L9.18 19.5L8.38 21.3C9.5 21.74 10.72 22 12 22C13.06 22 14.08 21.78 15.04 21.5L14.36 19.66L15.3 19.3L16 21.16C18.12 20.24 19.82 18.6 20.86 16.54L19.08 15.74L19.5 14.82L21.3 15.62C21.74 14.5 22 13.28 22 12C22 10.94 21.78 9.92 21.5 8.96L19.66 9.64M14.3 17.54C11.24 18.8 7.72 17.36 6.46 14.3S6.64 7.72 9.7 6.46 16.28 6.64 17.54 9.7C18.82 12.76 17.36 16.28 14.3 17.54Z"
            /></svg
          >
        </div>
        <div class="flex-1">4 Wheel</div>
      </div>
      <div class="flex items-center">
        <div class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="currentColor"
            ><path
              d="M8 5H4V2H8V5M4 22H8V19H4V22M14 2H10V5H14V2M10 22H14V19H10V22M16 2V5H20V2H16M17 11H13V7H11V11H7V7H5V17H7V13H11V17H13V13H19V7H17V11Z"
            /></svg
          >
        </div>
        <div class="flex-1">Manual</div>
      </div>
      <div class="flex items-center">
        <div class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="currentColor"
            ><path
              d="M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z"
            /></svg
          >
        </div>
        <div class="flex-1">Diesel</div>
      </div>
      <div class="flex items-center">
        <div class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="currentColor"
            ><path
              d="M9,22H17V19.5C19.41,17.87 21,15.12 21,12V4A2,2 0 0,0 19,2H15C13.89,2 13,2.9 13,4V12H3C3,15.09 5,18 9,19.5V22M5.29,14H18.71C18.14,15.91 16.77,17.5 15,18.33V20H11V18.33C9,18 5.86,15.91 5.29,14M15,4H19V12H15V4M16,5V8H18V5H16Z"
            /></svg
          >
        </div>
        <div class="flex-1">Toilet</div>
      </div>
      <div class="flex items-center">
        <div class="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="w-5 h-5"
            fill="currentColor"
            ><path
              d="M20,20A1,1 0 0,1 21,21A1,1 0 0,1 20,22A1,1 0 0,1 19,21A1,1 0 0,1 20,20M16,20A1,1 0 0,1 17,21A1,1 0 0,1 16,22A1,1 0 0,1 15,21A1,1 0 0,1 16,20M12,20A1,1 0 0,1 13,21A1,1 0 0,1 12,22A1,1 0 0,1 11,21A1,1 0 0,1 12,20M8,20A1,1 0 0,1 9,21A1,1 0 0,1 8,22A1,1 0 0,1 7,21A1,1 0 0,1 8,20M4,20A1,1 0 0,1 5,21A1,1 0 0,1 4,22A1,1 0 0,1 3,21A1,1 0 0,1 4,20M6,17A1,1 0 0,1 7,18A1,1 0 0,1 6,19H6A1,1 0 0,1 5,18A1,1 0 0,1 6,17H6M10,17A1,1 0 0,1 11,18A1,1 0 0,1 10,19A1,1 0 0,1 9,18A1,1 0 0,1 10,17M14,17A1,1 0 0,1 15,18A1,1 0 0,1 14,19A1,1 0 0,1 13,18A1,1 0 0,1 14,17M18,17A1,1 0 0,1 19,18A1,1 0 0,1 18,19A1,1 0 0,1 17,18A1,1 0 0,1 18,17M8,14A1,1 0 0,1 9,15A1,1 0 0,1 8,16A1,1 0 0,1 7,15A1,1 0 0,1 8,14M12,14A1,1 0 0,1 13,15A1,1 0 0,1 12,16A1,1 0 0,1 11,15A1,1 0 0,1 12,14M16,14A1,1 0 0,1 17,15A1,1 0 0,1 16,16A1,1 0 0,1 15,15A1,1 0 0,1 16,14M19,12H5V10H19V12M17.92,9H6.08C6.5,6.5 8.5,4.5 11,4.08V2H13V4.08C15.5,4.5 17.5,6.5 17.92,9Z"
            /></svg
          >
        </div>
        <div class="flex-1">Shower</div>
      </div>
    </div>
  </div>
</section>
<section class="bg-white">
  <div class="max-w-6xl mx-auto">
    {#if browser}
      <Carousel
        let:showPrevPage
        let:showNextPage
        autoplay
        autoplayDuration={5000}
        dots={false}
        pauseOnFocus={true}
        bind:this={carousel}
      >
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
          <div>
            <div
              class="h-96 bg-cover bg-center"
              style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/{item.image}');"
            />
            <div class="text-center p-4">{item.caption}</div>
          </div>
        {/each}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
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
    {/if}
  </div>
</section>
<section class="py-10 px-4">
  <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8">
    <div class="md:col-span-2 bg-white p-4 divide-y divide-gray-200">
        <h3 class="text-lg font-bold mb-4">Specifications</h3>
      {#each Array(5) as _}
        <div class="grid grid-cols-2 gap-2 py-2">
          <div class="font-bold">Water Supply</div>
          <div class="">Cold only</div>
        </div>
        <div class="grid grid-cols-2 gap-2 py-2">
          <div class="font-bold">Fresh Water Tank</div>
          <div class="">10 Litres</div>
        </div>
        <div class="grid grid-cols-2 gap-2 py-2">
          <div class="font-bold">Fresh Water Tank</div>
          <div class="">10 Litres</div>
        </div>
      {/each}
    </div>
    <div class="md:col-span-3 bg-white p-4">
      <Tabs>
        <Tab label="Description" />
        <Tab label="Restrictions" />
        <Tab label="Notes" />
        <svelte:fragment slot="content">
          <TabContent class="p-4">
            <p>
              The compact Adventure Camper is perfect for those interested in a
              real outback adventure. Far roomier than similar vehicles, this
              4WD campervan is ideal for thrill seeking couples.
            </p>
            <p>
              The extra fuel capacity means you can travel for longer without
              having to stop and the outdoor cooking facilities allows you to
              enjoy a dinner under the stars.
            </p>
            <p>
              Please note: Children under the age of 8 years old cannot travel
              in this vehicle.
            </p>
            <p>
              The extra fuel capacity means you can travel for longer without
              having to stop and the outdoor cooking facilities allows you to
              enjoy a dinner under the stars.
            </p>
            <p>
              Please Note: Vehicle specifications, floor plans, interior
              layouts, and specific measurements are subject to change without
              notice and may vary due to modifications and/or upgrades. Apollo
              Motorhome Holidays cannot be held liable for any such variance.
              Make/model may vary and cannot be guaranteed. **Media Player not
              available for all vehicle groups. Subject to change without
              notice. apollo for the most recent specifications.
            </p>
          </TabContent>
          <TabContent class="p-4">
            <p>
              Please note: Children under the age of 8 years old cannot travel
              in this vehicle.
            </p>
            <p>
              The extra fuel capacity means you can travel for longer without
              having to stop and the outdoor cooking facilities allows you to
              enjoy a dinner under the stars.
            </p>
          </TabContent>
          <TabContent class="p-4">
            <p>
              Please Note: Vehicle specifications, floor plans, interior
              layouts, and specific measurements are subject to change without
              notice and may vary due to modifications and/or upgrades. Apollo
              Motorhome Holidays cannot be held liable for any such variance.
              Make/model may vary and cannot be guaranteed. **Media Player not
              available for all vehicle groups. Subject to change without
              notice. apollo for the most recent specifications.
            </p>
          </TabContent>
        </svelte:fragment>
      </Tabs>
    </div>
  </div>
</section>
