import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: contents } = await supabase.rpc("home_data");
  const { data: states } = await supabase.rpc("travel_states");
  // const { data: states } = await supabase.from("categories").select("name, slug").in("type", "states");
  const { data: constants } = await supabase
    .from("constants")
    .select("type, name, subtitle, description")
    .in("type", [
      "intro",
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
      "summary",
      "contact",
    ]);

  let sections = {};
  constants.forEach((item) => {
    sections[item.type] = item;
  });

  return {
    contents,
    sections,
    states,
  };
}
