<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { Button, Checkbox, CopyButton } from "carbon-components-svelte";
  export let data;
  let stat = JSON.parse(data.stat.name);
  let domain = "https://www.australia4wdrentals.com";

  let generated_sitemap = {
    archives: {
      blog: {
        name: "Blog",
        url: `${domain}/blog`,
        status: "blog" in stat ? stat.archives.blog.status : true,
      },
      routes: {
        name: "Routes",
        url: `${domain}/routes`,
        status: "routes" in stat ? stat.archives.routes.status : true,
      },
      attractions: {
        name: "Attractions",
        url: `${domain}/attractions`,
        status: "attractions" in stat ? stat.archives.attractions.status : true,
      },
      events: {
        name: "Events",
        url: `${domain}/events`,
        status: "events" in stat ? stat.archives.events.status : true,
      },
      destinations: {
        name: "Destinations",
        url: `${domain}/destinations`,
        status: "destinations" in stat ? stat.archives.destinations.status : true,
      },
      specials: {
        name: "Specials",
        url: `${domain}/specials`,
        status: "specials" in stat ? stat.archives.specials.status : true,
      },
      vehicles: {
        name: "Vehicles",
        url: `${domain}/vehicles`,
        status: "vehicles" in stat ? stat.archives.vehicles.status : true,
      },
    },
  };
  data.sitemap.forEach(group => {
    generated_sitemap[group.type] = {}
    group.links.forEach(link => {
      let visible = true
      if (group.type in generated_sitemap) {
        if (link.slug in generated_sitemap[group.type]) {
          visible = generated_sitemap[group.type][link.slug].status
        }
      }
      generated_sitemap[group.type][link.slug] = {
        name: link.name,
        url: `${domain}/${group.type === "pages" ? "" : `${group.type}/`}${link.slug}`,
        status: visible,
      }
    })
  });
  console.log("sitemap", generated_sitemap);
  console.log("data", data);
  console.log("stat", stat);
</script>

<PageTitle title="Sitemap" path={data.path} />
<div class="bg-white p-4">
  {#each Object.entries(generated_sitemap) as [group, child]}
    <h2 class="h2 capitalize">{group}</h2>
    <div class="mb-4">
      {#each Object.entries(child) as [key, item]}
        <div class="flex items-center">
          <Checkbox labelText={item.name} bind:checked={item.status} />
          <div class="flex items-center">
            <Button kind="ghost" class="px-2" href={item.url}>Link</Button>
            <CopyButton text={item.url} />
          </div>
        </div>
      {/each}
    </div>
  {/each}
</div>
<br />
<Button on:click={() => {
  console.log(generated_sitemap)
}}></Button>
<div class="bg-white p-4">
  <h2 class="h2 capitalize">Archives</h2>
  <div class="mb-4">
    <div class="flex items-center">
      <Checkbox labelText="Blog" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/blog">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/blog" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Routes" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/routes">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/routes" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Attractions" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/attractions">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/attractions" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Events" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/events">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/events" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Destinations" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/destinations">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/destinations" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Specials" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/specials">Link</Button>
        <CopyButton text="https://www.australia4wdrentals.com/specials" />
      </div>
    </div>
    <div class="flex items-center">
      <Checkbox labelText="Vehicles" checked />
      <div class="flex items-center">
        <Button kind="ghost" class="px-2" href="/vehicles">Link</Button>
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
