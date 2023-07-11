import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: contents , error } = await supabase.rpc('home_data')
  const { data: constants } = await supabase
    .from("constants")
    .select("type, name, subtitle, description")
    .in("type", [
      "about",
      "destinations",
      "vehicles",
      "attractions",
      "routes",
      "specials",
      "features",
      "blog",
      "testimonials",
      "faqs",
      "contact",
    ]);

  let site = {};
  constants.forEach((item) => {
    site[item.type] = item;
  });

  return { contents, site };
}
