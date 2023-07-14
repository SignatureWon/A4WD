<script>
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { ToastNotification } from "carbon-components-svelte";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  let status = $page.url.searchParams.get("status");
  let message = $page.url.searchParams.get("message");
  let kind = "success";

  onMount(() => {
    status = $page.url.searchParams.get("status");
    message = $page.url.searchParams.get("message");
    if (status && message) {
      if (status === "error") {
        kind = "error";
      } else {
        kind = "success";
      }
      //   if (browser) {
      //     setTimeout(() => {
      //       goto($page.url.pathname);
      //     }, 2000);
      //   }
    }
  });
</script>

{#if status && message}
  <ToastNotification lowContrast {kind} title={message} timeout={4000} class="fixed top-1 right-1 z-[9999]" />
{/if}
