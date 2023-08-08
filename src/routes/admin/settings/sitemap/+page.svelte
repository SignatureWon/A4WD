<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { Button, Checkbox, CopyButton } from "carbon-components-svelte";
  export let data;
  console.log(data);
</script>

<PageTitle title="Sitemap" path={data.path} />

<div class="bg-white p-4">
  <h2 class="h2 capitalize">Archives</h2>
  <div class="mb-4">
    <div class="flex items-center">
      <Checkbox labelText="Pages" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/vehicles}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/vehicles" />
      </div>
      <div><a href="/pages">Link</a></div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Articles" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/vehicles}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/vehicles" />
      </div>
      <div><a href="/articles">Link</a></div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Routes" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/routes}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/routes" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Attractions" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/attractions}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/attractions" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Events" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/events}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/events" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Destinations" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/destinations}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/destinations" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Specials" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/specials}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/specials" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Vehicles" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/vehicles}">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/vehicles" />
      </div>
    </div>
  </div>

  {#each data.sitemap as group}
    <h2 class="h2 capitalize">{group.type}</h2>
    <div class="mb-4">
      {#each group.links as link}
        <div class="flex items-center">
          <Checkbox labelText={link.name} checked />
          <div class="flex items-center">
            <Button kind="ghost" class="px-2" href="{link.url}/{link.slug}">Link</Button>
            <CopyButton text="https://www.australia4wdrentals.com{link.url}/{link.slug}" />
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>
