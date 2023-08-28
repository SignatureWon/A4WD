import { supabase } from "$lib/supabaseClient";
export async function GET({ url }) {
  const { data: sitemap } = await supabase.from("constants").select("name").eq("type", "sitemap").single();
  const body = generate_sitemap(JSON.parse(sitemap.name));
  const response = new Response(body);
  response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
  response.headers.set("Content-Type", "application/xml");
  return response;
}
const generate_sitemap = (data) => {
  let xml = `<?xml version="1.0" encoding="UTF-8" ?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      const group = data[key];
      for (const slug in group) {
        if (Object.hasOwnProperty.call(group, slug)) {
          const link = group[slug];
          if (link.status) {
            xml += `<url>
              <loc>${link.url}</loc>
              <lastmod>${link.updated}</lastmod>
              <changefreq>daily</changefreq>
              <priority>0.7</priority>
            </url>`;
          }
        }
      }
    }
  }
  xml += `</urlset>`;
  return xml;
};

// const site = "https://www.australia4wheeldriverentals.com.au";

// export async function GET({ url }) {
//   const { data: contents } = await supabase
//     .from("contents")
//     .select("slug, type, updated_at")
//     .eq("status", true)
//     .in("type", [
//       "destinations",
//       "attractions",
//       "articles",
//       "vehicles",
//       "routes",
//     ])
//     .order("type", { ascending: true })
//     .order("rank", { ascending: true });

//   const { data: vehicles } = await supabase
//     .from("vehicles")
//     .select("slug, updated_at")
//     .eq("status", true)
//     .order("rank", { ascending: true });

//   const body = sitemap(contents, vehicles);
//   const response = new Response(body);
//   response.headers.set("Cache-Control", "max-age=0, s-maxage=3600");
//   response.headers.set("Content-Type", "application/xml");
//   return response;
// }

// const sitemap = (contents, vehicles) => `<?xml version="1.0" encoding="UTF-8" ?>
// <urlset
//   xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
//   xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
//   xmlns:xhtml="https://www.w3.org/1999/xhtml"
//   xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
//   xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
//   xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
// >
//   <url>
//     <loc>${site}</loc>
//     <changefreq>daily</changefreq>
//     <priority>0.7</priority>
//   </url>
//   ${contents
//     .map(
//       (c) => `
//   <url>
//     <loc>${c.type === "articles" ? "blog" : c.type}/${c.slug}</loc>
//     <changefreq>daily</changefreq>
//     <lastmod>${c.updated_at}</lastmod>
//     <priority>0.7</priority>
//   </url>
//   `
//     )
//     .join("")}
//   ${vehicles
//     .map(
//       (v) => `
//   <url>
//     <loc>vehicles/${v.slug}</loc>
//     <changefreq>daily</changefreq>
//     <lastmod>${v.updated_at}</lastmod>
//     <priority>0.7</priority>
//   </url>
//   `
//     )
//     .join("")}
// </urlset>`;
