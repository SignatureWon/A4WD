<script>
  import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";

  export let id = "";
  export let title = "Title";
  export let path = "";
  export let data = false;

  const level = path.split("/");
  let pages = [];
  let link = "";
  level.forEach((item, index) => {
    if (index > 0 && index < level.length - 1) {
      if (index < 4) {
        link += `/${item}`;
        pages.push({
          name: item,
          link: link,
        });
      }
    }
  });
</script>

<div class="pb-5">
  <Breadcrumb>
    {#each pages as page}
      <BreadcrumbItem
        href={page.link}
        class="capitalize inline text-xs [&>a]:text-sm"
      >
        {page.name.replace("_", " ")}
      </BreadcrumbItem>
    {/each}
  </Breadcrumb>
  <h2 class="text-2xl font-bold">
    {#if data}
      {#if id === "add"}
        Add {title}
      {:else}
        {data.name || data.reference}
      {/if}
    {:else}
      {title}
    {/if}
  </h2>
</div>
