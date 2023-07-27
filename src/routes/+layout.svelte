<script>
  import { supabase } from "$lib/supabaseClient";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { navigating } from "$app/stores";

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      invalidate("supabase:auth");
    });

    return () => {
      subscription.unsubscribe();
    };
  });

  // import "carbon-components-svelte/css/g10.css";
  import "$lib/css/app.css";
</script>
{#if $navigating}
<div class="fixed h-screen w-screen top-0 left-0 bg-black/70 z-50">
  <div class="flex w-full h-full items-center justify-center">
    <div class="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </div>
</div>
{/if}
<slot />
