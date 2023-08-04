<script>
  import { Search, Select, SelectItem } from "carbon-components-svelte";
  import { goto } from "$app/navigation";

  export let title;
  export let options = [];
  export let category;
  export let keyword;
  export let url;
</script>

<div class="bg-white">
  <div class="container xl:max-w-7xl mx-auto py-2 px-4 md:px-0">
    <div class="flex items-center">
      <div class="flex-1">
        <div class="flex space-x-2 items-center">
          {#if title}
            <div class="h2">{title}</div>
          {/if}
          {#if options.length}
            <div class="max-w-md">
              <Select class="[&>.bx--select]:-mt-1.5" bind:selected={category} on:change={(e) => {
                goto(`${url}?keyword=${keyword}&category=${category}`)
              }}>
                <SelectItem value="" text="All" />
                {#each options as opt}
                  <SelectItem value={opt.value} text={opt.name} />
                {/each}
              </Select>
            </div>
          {/if}
        </div>
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
