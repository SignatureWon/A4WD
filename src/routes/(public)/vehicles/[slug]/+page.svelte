<script>
  import { supabase } from "$lib/supabaseClient";
  // import { browser } from "$app/environment";
  // import "@splidejs/splide/css";
  // import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import Gallery from "$lib/components/public/Gallery.svelte";
  import { Button, Tab, TabContent, Tabs } from "carbon-components-svelte";
  import {
    InlineNotification,
    NotificationActionButton,
  } from "carbon-components-svelte";
  let slug = $page.params.slug;
  let record = {
    specifications: [],
    images: [],
  };
  let errors = {};
  let loading = false;

  onMount(async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("vehicles")
        .select()
        .eq("slug", slug)
        .single();

      record = data;
      // console.log(record.specifications.length);

      if (error) throw error;

      if (data) {
        record = data;
      }
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }

    // new Splide(".carousel-vgallery", {
    //   type: "loop",
    //   drag: true,
    //   autoplay: true,
    //   interval: 5000,
    // }).mount();
  });
</script>

<Loading {loading} />
{#if errors.code}
  <InlineNotification
    hideCloseButton
    lowContrast
    kind="error"
    title="Error:"
    subtitle={errors.message}
  >
    <svelte:fragment slot="actions">
      <NotificationActionButton on:click={() => goto("/")}>
        Back to home
      </NotificationActionButton>
    </svelte:fragment>
  </InlineNotification>
{:else}
  <PageHeader>
    <div
      class="h-96 bg-cover bg-center"
      style={record.image
        ? `background-image: url('${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/${record.image}');`
        : ""}
    >
      <div
        class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
      >
        <h1 class="text-4xl font-bold text-white">{record.name}</h1>
      </div>
    </div>
  </PageHeader>
{/if}
<section class="bg-white px-4">
  <div class="py-10 max-w-3xl mx-auto">
    <p class="text-xl mb-8">
      {record.excerpt}
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
        <div class="flex-1">{record.pax} Bed</div>
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
        <div class="flex-1">{record.wheel}</div>
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
        <div class="flex-1">{record.transmission}</div>
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
        <div class="flex-1">{record.fuel}</div>
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
        <div class="flex-1">{record.toilet ? "Toilet" : "N/A"}</div>
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
        <div class="flex-1">{record.shower ? "Shower" : "N/A"}</div>
      </div>
    </div>
  </div>
</section>
<Gallery records={record.images} />
<!-- <section class="container xl:max-w-7xl mx-auto mt-8">
  <div class="splide carousel-vgallery">
    <div class="splide__track">
      <ul class="splide__list">
        {#each record.images as item}
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
  </div>
</section> -->
<section class="container xl:max-w-6xl mx-auto bg-white p-4">
  <h3 class="text-lg font-bold mb-4">Specifications</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
    {#each record.specifications as spec}
      <div class="grid grid-cols-2 gap-2 py-2 border-b border-gray-200">
        <div class="font-bold">{spec.Title}</div>
        <div class="">{spec.Description}</div>
      </div>
    {/each}
  </div>
</section>
<section class="p-4 container xl:max-w-7xl mx-auto bg-white my-8">
  <Tabs>
    <Tab label="Description" />
    <Tab label="Restrictions" />
    <Tab label="Notes" />
    <svelte:fragment slot="content">
      <TabContent class="p-4">
        {@html record.description}
      </TabContent>
      <TabContent class="p-4">
        {@html record.restrictions}
      </TabContent>
      <TabContent class="p-4">
        {@html record.notes}
      </TabContent>
    </svelte:fragment>
  </Tabs>
</section>
