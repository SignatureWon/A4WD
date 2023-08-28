<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import { Button, Checkbox, CopyButton } from "carbon-components-svelte";
  import dayjs from "dayjs";
  export let data;
  let stat = JSON.parse(data.stat.name);
  let domain = "https://www.australia4wdrentals.com";

  let generated_sitemap = {
    archives: {
      blog: {
        name: "Blog",
        url: `${domain}/blog`,
        updated: dayjs(),
        status: "blog" in stat.archives ? stat.archives.blog.status : true,
      },
      routes: {
        name: "Routes",
        url: `${domain}/routes`,
        updated: dayjs(),
        status: "routes" in stat.archives ? stat.archives.routes.status : true,
      },
      attractions: {
        name: "Attractions",
        url: `${domain}/attractions`,
        updated: dayjs(),
        status: "attractions" in stat.archives ? stat.archives.attractions.status : true,
      },
      events: {
        name: "Events",
        url: `${domain}/events`,
        updated: dayjs(),
        status: "events" in stat.archives ? stat.archives.events.status : true,
      },
      destinations: {
        name: "Destinations",
        url: `${domain}/destinations`,
        updated: dayjs(),
        status: "destinations" in stat.archives ? stat.archives.destinations.status : true,
      },
      specials: {
        name: "Specials",
        url: `${domain}/specials`,
        updated: dayjs(),
        status: "specials" in stat.archives ? stat.archives.specials.status : true,
      },
      vehicles: {
        name: "Vehicles",
        url: `${domain}/vehicles`,
        updated: dayjs(),
        status: "vehicles" in stat.archives ? stat.archives.vehicles.status : true,
      },
    },
  };
  // generate latest sitemap
  data.sitemap.forEach((group) => {
    generated_sitemap[group.type] = {};
    group.links.forEach((link) => {
      let slug = link.slug.replaceAll("-", "_");
      let dir = group.type;
      if (dir === "pages") {
        dir = ""
      }
      if (dir === "attachments") {
        dir = "files"
      }
      generated_sitemap[group.type][slug] = {
        name: link.name,
        url: `${domain}/${dir}/${link.slug}`,
        updated: link.updated,
        status: true,
      };
    });
  });
  // set status from database
  for (const key in stat) {
    if (Object.hasOwnProperty.call(stat, key)) {
      const group = stat[key];
      for (const slug in group) {
        if (Object.hasOwnProperty.call(group, slug)) {
          const link = group[slug];
          if (slug in generated_sitemap[key]) {
            generated_sitemap[key][slug].status = stat[key][slug].status;
          }
        }
      }
    }
  }
  // console.log("sitemap", generated_sitemap);
  // console.log("data", data);
  // console.log("stat", stat.pages);
  let stringSitemap = JSON.stringify(generated_sitemap);
  const updateSitemap = () => {
    stringSitemap = JSON.stringify(generated_sitemap);
  };
</script>

<PageTitle title="Sitemap" path={data.path} />
<form method="POST">
  <input type="hidden" name="name" value={stringSitemap} />
  <div class="p-2 text-right border-b border-gray-200 bg-white">
    <Button type="submit">Save</Button>
  </div>
  <div class="bg-white p-4">
    {#each Object.entries(generated_sitemap) as [group, child]}
      <h2 class="h2 capitalize">{group}</h2>
      <div class="mb-4">
        {#each Object.entries(child) as [key, item]}
          <div class="flex items-center">
            <Checkbox labelText={item.name} bind:checked={item.status} on:change={updateSitemap} />
            <div class="flex items-center">
              <Button kind="ghost" class="px-2" href={item.url}>Link</Button>
              <CopyButton text={item.url} />
            </div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div class="p-2 text-right border-t border-gray-200 bg-white">
    <Button type="submit">Save</Button>
  </div>
</form>
