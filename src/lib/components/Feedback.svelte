<script>
  import {
    InlineNotification,
    NotificationActionButton,
    ToastNotification,
  } from "carbon-components-svelte";

  export let data = {};

  import { page } from "$app/stores";
  let id = $page.params.id;
  let backUrl = $page.url.pathname.replace(`/${id}`, "");
</script>

{#if data.error}
  <div class="fixed bg-white w-full h-full z-50 left-0 top-12 px-5 py-2">
    <InlineNotification
      lowContrast
      hideCloseButton
      kind="error"
      title="Error:"
      subtitle={data.message}
      class="mx-auto"
    >
      <svelte:fragment slot="actions">
        <NotificationActionButton href={backUrl} class="!py-1.5">
          Back
        </NotificationActionButton>
      </svelte:fragment>
    </InlineNotification>
  </div>
{:else if data.inserted}
  <ToastNotification
    lowContrast
    kind="success"
    title="Created successfully"
    timeout={3000}
    class="fixed top-1 right-1 z-[9999]"
  />
{:else if data.updated}
  <ToastNotification
    lowContrast
    kind="success"
    title="Updated successfully"
    timeout={3000}
    class="fixed top-1 right-1 z-[9999]"
  />
{:else if data.deleted}
  <ToastNotification
    lowContrast
    kind="success"
    title="Deleted successfully"
    timeout={3000}
    class="fixed top-1 right-1 z-[9999]"
  />
{:else if data.duplicated}
  <ToastNotification
    lowContrast
    kind="success"
    title="Duplicated successfully"
    timeout={3000}
    class="fixed top-1 right-1 z-[9999]"
  />
{/if}
