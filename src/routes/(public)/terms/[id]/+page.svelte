<script>
  import { Tabs, Tab, TabContent } from "carbon-components-svelte";
  import { f } from "$lib/file";
  import { env } from "$env/dynamic/public";
  export let data;
  const t = data.data;
</script>

<section class="bg-white">
  <div class="mx-auto max-w-3xl px-5 py-10">
    <h1 class="text-2xl font-bold mb-8">
      {t.name}
    </h1>
    <Tabs autoWidth>
      {#if t.summary_terms !== "<p></p>" || t.summary}
        <Tab label="Summary of Terms" />
      {/if}
      {#if t.confirmation_terms !== "<p></p>" || t.confirmation}
        <Tab label="Booking Confirmation Terms" />
      {/if}
      {#if t.counter_terms !== "<p></p>" || t.counter}
        <Tab label="Counter Agreement" />
      {/if}
      <svelte:fragment slot="content">
        {#if t.summary_terms !== "<p></p>" || t.summary}
          <TabContent>
            <div class="p-4">
              <h2 class="text-xl font-bold mb-8">Summary of Terms</h2>
              {#if t.summary_terms !== "<p></p>"}
                {@html t.summary_terms}
              {/if}
              {#if t.summary}
                <h3 class="text-lg font-bold mt-8">Attachment</h3>
                <!-- svelte-ignore a11y-missing-content -->
                <a
                  href="{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/terms/{t.summary}"
                  target="_blank"
                  rel="noreferrer"
                  class="file-icon file-icon-xl"
                  data-type={f.extension(t.summary)}
                />
              {/if}
            </div>
          </TabContent>
        {/if}
        {#if t.confirmation_terms !== "<p></p>" || t.confirmation}
          <TabContent>
            <div class="p-4">
              <h2 class="text-xl font-bold mb-8">Booking Confirmation Terms</h2>
              {#if t.confirmation_terms !== "<p></p>"}
                {@html t.confirmation_terms}
              {/if}
              {#if t.confirmation}
                <h3 class="text-lg font-bold mt-8">Attachment</h3>
                <!-- svelte-ignore a11y-missing-content -->
                <a
                  href="{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/terms/{t.confirmation}"
                  target="_blank"
                  rel="noreferrer"
                  class="file-icon file-icon-xl"
                  data-type={f.extension(t.confirmation)}
                />
              {/if}
            </div>
          </TabContent>
        {/if}
        {#if t.counter_terms !== "<p></p>" || t.counter}
          <TabContent>
            <div class="p-4">
              <h2 class="text-xl font-bold mb-8">Counter Agreement</h2>
              {#if t.counter_terms !== "<p></p>"}
                {@html t.counter_terms}
              {/if}
              {#if t.counter}
                <h3 class="text-lg font-bold mt-8">Attachment</h3>
                <!-- svelte-ignore a11y-missing-content -->
                <a
                  href="{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/terms/{t.counter}"
                  target="_blank"
                  rel="noreferrer"
                  class="file-icon file-icon-xl"
                  data-type={f.extension(t.counter)}
                />
              {/if}
            </div>
          </TabContent>
        {/if}
      </svelte:fragment>
    </Tabs>
  </div>
</section>
