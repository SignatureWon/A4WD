<script>
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import PageNotFound from "$lib/components/public/PageNotFound.svelte";
  import FeaturedImage from "$lib/components/public/FeaturedImage.svelte";
  import PageTitle from "$lib/components/public/single/PageTitle.svelte";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  import ImageGallery from "$lib/components/public/single/ImageGallery.svelte";
  import VehicleSpecs from "../../../../lib/components/public/single/VehicleSpecs.svelte";
  import { Tab, TabContent, Tabs } from "carbon-components-svelte";

  export let data;

  const record = data.data;
</script>

{#if !record}
  <PageNotFound />
{:else}
  <PageHeader>
    <FeaturedImage {record} />
  </PageHeader>
  <div
    class="container xl:max-w-7xl mx-auto bg-white my-8 divide-y divide-gray-200"
  >
    <section class="p-5 mb-5">
      <PageTitle {record} parent={{
        name: "Vehicles",
        url: "/vehicles"
      }} />
      <VehicleFeatures {record} />
    </section>
    <ImageGallery images={record.images} />
    <VehicleSpecs specs={record.specifications} />

    <section class="pt-8 bg-gray-100">
      <Tabs class="border-b-2 border-gray-200">
        {#if record.description !== "" && record.description !== null}
          <Tab label="Description" />
        {/if}
        {#if record.restrictions !== "" && record.restrictions !== null}
          <Tab label="Restrictions" />
        {/if}
        {#if record.notes !== "" && record.notes !== null}
          <Tab label="Notes" />
        {/if}
        {#if record.faqs.length > 0 && record.faqs !== null}
          <Tab label="FAQs" />
        {/if}
        <svelte:fragment slot="content">
          {#if record.description !== "" && record.description !== null}
            <TabContent class="p-5 bg-white">
              {@html record.description}
            </TabContent>
          {/if}
          {#if record.restrictions !== "" && record.restrictions !== null}
            <TabContent class="p-5 bg-white">
              {@html record.restrictions}
            </TabContent>
          {/if}
          {#if record.notes !== "" && record.notes !== null}
            <TabContent class="p-5 bg-white">
              {@html record.notes}
            </TabContent>
          {/if}
          {#if record.faqs.length > 0 && record.faqs !== null}
            <TabContent class="p-5 bg-white">
              <div class="divide-y divide-gray-200">
                {#each record.faqs as faq}
                  <div class="py-4">
                    <div class="font-bold mb-4">{faq.Title}</div>
                    <div class="mb-2">{faq.Question}</div>
                    <div class="text-gray-500">{faq.Answer}</div>
                  </div>
                {/each}
              </div>
            </TabContent>
          {/if}
        </svelte:fragment>
      </Tabs>
    </section>
  </div>
{/if}

<!-- <script>
  import { supabase } from "$lib/supabaseClient";
  // import { browser } from "$app/environment";
  // import "@splidejs/splide/css";
  // import Splide from "@splidejs/splide";
  import Splide from "@splidejs/splide";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import FeaturedImage from "$lib/components/public/FeaturedImage.svelte";
  import Gallery from "$lib/components/public/Gallery.svelte";
  import { Button, Tab, TabContent, Tabs } from "carbon-components-svelte";
  import {
    InlineNotification,
    NotificationActionButton,
  } from "carbon-components-svelte";
  import VehicleFeatures from "$lib/components/public/single/VehicleFeatures.svelte";
  let slug = $page.params.slug;
  let record = {
    specifications: [],
    images: [],
    faqs: [],
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
      if (error) throw error;

      if (data) {
        record = data;
      }
    } catch (error) {
      errors = error;
    } finally {
      loading = false;
    }
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
    <FeaturedImage {record} />
  </PageHeader>
{/if}
<section class="bg-white px-4 mb-8">
  <div class="py-10 max-w-3xl mx-auto">
    <VehicleFeatures {record} />
  </div>
</section>
<Gallery records={record.images} />
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
    <Tab label="FAQs" />
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
      <TabContent class="px-4">
        <div class="divide-y divide-gray-200">
          {#each record.faqs as faq}
            <div class="py-4">
              <div>{faq.Title}</div>
              <div>{faq.Question}</div>
              <div>{faq.Answer}</div>
            </div>
          {/each}
        </div>
      </TabContent>
    </svelte:fragment>
  </Tabs>
</section> -->
