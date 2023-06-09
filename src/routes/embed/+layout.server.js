import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: constants } = await supabase
    .from("constants")
    .select("type, name, subtitle, description")
    .in("type", ["color"]);

  let site = {};
  constants.forEach((item) => {
    site[item.type] = item.name;
  });

  return { site };
}
