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
      "events",
      "features",
      "blog",
      "testimonials",
      "faqs",
      "contact",
    ]);

  let sections = {};
  constants.forEach((item) => {
    sections[item.type] = item;
  });

  return { contents, sections };
}
