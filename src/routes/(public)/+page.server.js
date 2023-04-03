import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: contents } = await supabase
    .from("contents")
    .select()
    .in("type", [
      "announcements",
      "banners",
      "destinations",
      "attractions",
      "routes",
      "testimonials",
      "faqs",
      "features",
    ])
    .eq("status", true)
    .order("rank", { ascending: true });

  const { data: blog } = await supabase
    .from("contents")
    .select()
    .eq("type", "articles")
    .eq("status", true)
    .order("rank", { ascending: true })
    .limit(5);

  const { data: constants } = await supabase
    .from("constants")
    .select("type, name, subtitle, description")
    .in("type", [
      "about",
      "destinations",
      "attractions",
      "routes",
      "specials",
      "features",
      "blog",
      "testimonials",
      "faqs",
    ]);

  let site = {};
  constants.forEach((item) => {
    site[item.type] = item;
  });

  return { contents, blog, site };
}
