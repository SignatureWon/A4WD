<script>
  import { PaginationNav } from "carbon-components-svelte";
  import { goto } from "$app/navigation";
  import { page as pageStore } from "$app/stores";

  export let records = [];
  export let url;
  export let page;
  export let total;
</script>

<div class="container xl:max-w-7xl mx-auto px-4 md:px-0 pt-8">
  {#if records.length === 0}
    <div class="px-4 py-20 text-center">
      <div>No records yet</div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <slot />
    </div>
  {/if}
</div>
<div class="flex justify-center py-8">
  <PaginationNav
    {total}
    shown={5}
    {page}
    on:change={(e) => {
      goto(`${url}?${$pageStore.url.searchParams.get("category") ? `category=${$pageStore.url.searchParams.get("category")}&` : ""}page=${e.detail.page}`);
    }}
  />
</div>
