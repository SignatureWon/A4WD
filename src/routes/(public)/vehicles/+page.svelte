<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import Loading from "$lib/components/Loading.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";
  import ArchiveList from "$lib/components/public/ArchiveList.svelte";
  import {
    InlineNotification,
    NotificationActionButton,
  } from "carbon-components-svelte";
  let archives = "vehicles"
  let records = [];
  let errors = {};
  let loading = false;
  let info = {};

  onMount(async () => {
    try {
      loading = true;
      const { data: dataConstants, error: errorConstants } = await supabase
        .from("constants")
        .select()
        .eq("type", "vehicles")
        .single();

      if (errorConstants) throw error;

      if (dataConstants) {
        info = dataConstants;
      }

      const { data: dataContents, error: errorContents } =
        await supabase.from("vehicles").select().eq("status", true);

      if (errorContents) throw error;

      if (dataContents) {
        records = dataContents;
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
    <div class="h-96 bg-cover bg-center">
      <div
        class="w-full h-full bg-black/20 flex flex-col items-center justify-center text-center p-10"
      >
        <h1 class="text-4xl font-bold text-white mb-4">{info.name}</h1>
        <div class="text-brand-200 text-2xl mb-4">
          {info.subtitle}
        </div>
      </div>
    </div>
  </PageHeader>
  <ArchiveList {records} {archives} />
{/if}