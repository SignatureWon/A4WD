<script>
  import { supabase } from "$lib/supabaseClient";
  import { Breadcrumb, BreadcrumbItem } from "carbon-components-svelte";
  import { page } from "$app/stores";
  export let name = "Title";
  export let table = "table";
  export let field = "name";

  let path = $page.url.pathname.split("/");
  let breadcrumbs, link;

  let id = $page.params.id;
  $: {
    id = $page.params.id;
    path = $page.url.pathname.split("/");
    breadcrumbs = [];
    link = "";

    for (let index = 1; index < path.length - 1; index++) {
      link += `/${path[index]}`;
      breadcrumbs.push({
        label: path[index],
        link: link,
      });
    }
  }

  const getName = async () => {
    const { data, error } = await supabase
      .from(table)
      .select(field)
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
    }
    return data.name;
  };
</script>

<div class="pb-5">
  <Breadcrumb>
    {#each breadcrumbs as item}
      <BreadcrumbItem
        href={item.link}
        class="capitalize inline text-xs [&>a]:text-sm"
      >
        {item.label}
      </BreadcrumbItem>
    {/each}
  </Breadcrumb>
  <h2 class="text-2xl font-bold">
    {#if id}
      {#if id === "add"}
        Add {name}
      {:else}
        {#await getName() then recordName}
          {recordName}
        {/await}
      {/if}
    {:else}
      {name}
    {/if}
  </h2>
</div>
