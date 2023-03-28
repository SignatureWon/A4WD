import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: contents } = await supabase
    .from("contents")
    .select("type, name, featured, slug, categories (name)")
    .in("type", ["announcements", "pages"])
    .eq("status", true);

  const { data: constants } = await supabase
    .from("constants")
    .select("type, name, subtitle, description")
    .in("type", [
      "title",
      "description",
      "keywords",
      "hotline",
      "logo",
      "icon",
      "color",
      "contact",
    ]);

  let site = {};
  constants.forEach((item) => {
    if (item.type === "contact") {
      site[item.type] = item;
    } else {
      site[item.type] = item.name;
    }
  });

  return { contents, site };
}
