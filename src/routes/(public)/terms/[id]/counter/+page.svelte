<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { f } from "$lib/file";
  import { env } from "$env/dynamic/public";
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
    {/if}
    {#if t.counter}
    <div class="h-screen">
      <iframe
        src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://api.australia4wdrentals.com/storage/v1/object/public/terms/{t.counter}#toolbar=0&scrollbar=0"
        frameBorder="0"
        scrolling="auto"
        height="100%"
        width="100%"
        title={t.name}
      />
    </div>
    <!-- <h3 class="text-lg font-bold mt-8">Attachment</h3> -->
      <!-- svelte-ignore a11y-missing-content -->
      <!-- <a
        href="{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/terms/{t.counter}"
        target="_blank"
        rel="noreferrer"
        class="file-icon file-icon-xl"
        data-type={f.extension(t.counter)}
      /> -->
    {/if}
  </div>
</section>
