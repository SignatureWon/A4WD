import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
export async function GET({ url }) {
  const { data: sitemap } = await supabase.rpc("sitemaps");
  const { data: status } = await supabase.from("constants").select("name").eq("type", "sitemap").single();
  let domain = "https://www.australia4wdrentals.com";
  let stat = JSON.parse(status.name);
  let generated_sitemap = {
    archives: {
      blog: {
        name: "Blog",
        url: `${domain}/blog`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "blog" in stat.archives ? stat.archives.blog.status : true,
      },
      routes: {
        name: "Routes",
        url: `${domain}/routes`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "routes" in stat.archives ? stat.archives.routes.status : true,
      },
      attractions: {
        name: "Attractions",
        url: `${domain}/attractions`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "attractions" in stat.archives ? stat.archives.attractions.status : true,
      },
      events: {
        name: "Events",
        url: `${domain}/events`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "events" in stat.archives ? stat.archives.events.status : true,
      },
      destinations: {
        name: "Destinations",
        url: `${domain}/destinations`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "destinations" in stat.archives ? stat.archives.destinations.status : true,
      },
      specials: {
        name: "Specials",
        url: `${domain}/specials`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "specials" in stat.archives ? stat.archives.specials.status : true,
      },
      vehicles: {
        name: "Vehicles",
        url: `${domain}/vehicles`,
        updated: dayjs().format("YYYY-MM-DDThh:mm:ssZ"),
        status: "vehicles" in stat.archives ? stat.archives.vehicles.status : true,
      },
    },
  };
  // generate latest sitemap
  sitemap.forEach((group) => {
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
  const body = generate_sitemap_xml(generated_sitemap);
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}
const generate_sitemap_xml = (data) => {
  let xml = `<?xml version="1.0" encoding="UTF-8" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (const group in data) {
    for (const key in data[group]) {
      const link = data[group][key];
      if (link.status) {
        xml += `<url>
          <loc>${link.url.replace("com//", "com/")}</loc>
          <lastmod>${link.updated}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>`;
      }
    }
  }
  xml += `</urlset>`;
  return xml;
};
