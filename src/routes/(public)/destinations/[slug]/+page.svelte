<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import {
    InlineNotification,
    NotificationActionButton,
  } from "carbon-components-svelte";
  let slug = $page.params.slug;
  let record = {};
  let errors = {};
  let loading = false;

  onMount(async () => {
    try {
      loading = true;
      const { data, error } = await supabase
        .from("contents")
        .select()
        .eq("slug", slug)
        .single();

      record = data;
      // console.log(record);

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
    <div
      class="h-[460px] bg-cover bg-center"
      style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{record.image}');"
    >
      <div
        class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
      >
        <h1 class="text-4xl font-bold text-white">{record.name}</h1>
      </div>
    </div>
  </PageHeader>
  <div class="max-w-5xl py-10 px-5 mx-auto">
    {@html record.content}

    {@html record.description}

  </div>
{/if}
