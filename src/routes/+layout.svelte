<script>
  import { supabase } from "$lib/supabaseClient";
  import { invalidate } from "$app/navigation";
  import { onMount } from "svelte";
  import { navigating } from "$app/stores";
  import { theme } from "$lib/theme.js";

  export let data;
  const c = theme.brandcolor(data.site.color);

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

  import "$lib/css/app.css";
</script>

<svelte:head>
  <meta name="keywords" content={data.site.keywords} />
  <link rel="icon" href={`${data.baseUrl}/storage/v1/object/public/contents/${data.site.icon}`} />
</svelte:head>

<div
  style="--brand50: {c.brand50}; --brand100: {c.brand100}; --brand200: {c.brand200}; --brand300: {c.brand300}; --brand400: {c.brand400}; --brand-color: {c.brand500}; --brand600: {c.brand600}; --brand700: {c.brand700}; --brand-color-hover: {c.brand800}; --brand900: {c.brand900};"
>
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
</div>
