<script>
  import { env } from "$env/dynamic/public";
  import { Button } from "carbon-components-svelte";
  import dayjs from "dayjs";
  export let records = [];
  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };
</script>

<section class="bg-white">
  <div class="space-y-8 container xl:max-w-7xl mx-auto px-4 py-16">
    <div class="text-center">
      <div
        class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
      >
        Blog
      </div>
      <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
        {title.subtitle}
      </h2>
      {#if title.description}
      <p class="mb-4 text-xl text-gray-600">
        {@html title.description}
      </p>
    {/if}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2">
      {#each records as item, index}
        <div class="group {index === 0 ? 'md:col-span-2' : ''}">
          <a href="/blog/{item.slug}">
            <div class={index === 0 ? "md:flex" : ""}>
              <div
                class="{index === 0
                  ? 'md:w-2/3'
                  : ''} overflow-hidden rounded m-4"
              >
                <div
                  class="h-80 bg-cover bg-center transition-all group-hover:scale-125"
                  style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{item.image}');"
                />
              </div>
              <div
                class="{index === 0 ? 'md:w-1/3' : ''} m-4 h-80 overflow-hidden"
              >
                <p class="text-gray-400 text-sm font-medium">
                  {dayjs(item.created_at).format("MMM D, YYYY")}
                </p>
                <h3 class="font-bold text-xl mb-2">
                  {item.name}
                </h3>
                <div class="text-base text-gray-600">
                  {@html item.content}
                </div>
              </div>
            </div>
          </a>
        </div>
      {/each}
    </div>
    <div class="text-center pt-8">
      <Button href="/blog" class="inline-block">More Articles</Button>
    </div>
  </div>
</section>
