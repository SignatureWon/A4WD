<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { Checkbox } from "carbon-components-svelte";
  export let data;
  console.log(data);
</script>

<PageTitle title="Sitemap" path={data.path} />

<div class="bg-white p-4">
  {#each data.sitemap as group}
    <h2 class="h2 capitalize">{group.type}</h2>
    <div class="mb-4">
      {#each group.links as link}
        <Checkbox labelText={link.name} />
      {/each}
    </div>
  {/each}
</div>
