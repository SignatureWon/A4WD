<script>
  import { Search, Select, SelectItem } from "carbon-components-svelte";
  import { goto } from "$app/navigation";

  export let title;
  export let keyword;
  export let url;
</script>

<div class="bg-white">
  <div class="container xl:max-w-7xl mx-auto py-2 px-4 md:px-0">
    <div class="flex items-center">
      <div class="flex-1">
        {#if title}
          <div class="h2">{title}</div>
        {/if}
      </div>
      <div>
        <Search
          bind:value={keyword}
          on:clear={(e) => {
            goto(url);
          }}
          on:change={(e) => {
            goto(`${url}?keyword=${keyword}`);
          }}
        />
      </div>
    </div>
  </div>
</div>
