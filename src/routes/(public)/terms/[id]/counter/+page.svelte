<script>
  // import { env } from "$env/dynamic/public";
  export let data;
  const t = data.data;
</script>
<section class="bg-white">
  <div class="mx-auto max-w-3xl px-5 py-10">
    <h1 class="text-3xl font-bold mb-2">
      {t.name}
    </h1>
    <h2 class="text-xl font-bold mb-8">
      Counter Agreement
    </h2>
    {#if t.counter_terms !== "<p></p>"}
      {@html t.counter_terms}
    {:else}
      No Terms Found
    {/if}
    <!-- {#if t.confirmation}
    <div class="h-screen">
      <iframe
        src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://api.australia4wdrentals.com/storage/v1/object/public/terms/{t.confirmation}#toolbar=0&scrollbar=0"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%"
        title={t.name}
      />
    </div>
    {/if} -->
  </div>
</section>
