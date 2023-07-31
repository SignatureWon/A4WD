import { getServerSession } from "@supabase/auth-helpers-sveltekit";
import { supabase } from "$lib/supabaseClient";
import { env } from "$env/dynamic/public";

export const load = async (event) => {
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
      "facebook",
      "instagram",
      "twitter",
    ]);

  let site = {};
  constants.forEach((item) => {
    if (item.type === "contact") {
      site[item.type] = item;
    } else {
      site[item.type] = item.name;
    }
  });

  const session = await getServerSession(event);
  const baseUrl = env.PUBLIC_SUPABASE_URL;

  return {
    session,
    site,
    baseUrl,
  };
};
