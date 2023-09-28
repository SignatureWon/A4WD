<script>
  import PageTitle from "$lib/components/admin/PageTitle.svelte";
  import dayjs from "dayjs";
  export let data;
  let stat = JSON.parse(data.stat.name);
  let domain = "";

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
        dir = "";
      }
      if (dir === "attachments") {
        dir = "files";
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

<div class="p-5 container xl:max-w-7xl mx-auto bg-white rounded my-8">
  <PageTitle title="Sitemap" />
  {#each Object.entries(generated_sitemap) as [group, child]}
    <h2 class="h2 capitalize">{group}</h2>
    <div class="mb-4">
      <ul class="list-disc pl-4">
        {#each Object.entries(child) as [key, item]}
          {#if item.status}
            <li><a href={item.url.replace("//", "/")}>{item.name}</a></li>
          {/if}
        {/each}
      </ul>
    </div>
  {/each}
</div>
