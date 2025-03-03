<script>
  import { env } from "$env/dynamic/public";
  export let archives = "";
  export let records = [];
</script>

<div class="max-w-7xl py-10 px-5 mx-auto">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each records as item}
      <div class="bg-white rounded overflow-hidden group">
        <a href="/{archives}/{item.slug}">
          <div class="h-60 sm:h-48 overflow-hidden">
            <div
              class="h-60 sm:h-48 bg-cover bg-center transition-all group-hover:scale-125 bg-gray-300"
              style="background-image: url('{env.PUBLIC_URL}/storage/v1/object/public/contents/{item.image}');"
            />
          </div>
          <h3 class="p-4 font-bold">{item.name}</h3>
        </a>
      </div>
    {/each}
  </div>
</div>
