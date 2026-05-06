import { env } from "$env/dynamic/public";

export const load = async (event) => {
  event.depends("supabase:auth");

  const { data: constants } = await event.locals.sb
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
      "h1",
      "image",
    ]);

  let site = {};
  constants.forEach((item) => {
    if (item.type === "contact") {
      site[item.type] = item;
    } else {
      site[item.type] = item.name;
    }
  });

  const session = event.locals.session;
  const baseUrl = env.PUBLIC_URL;

  return {
    session,
    site,
    baseUrl,
  };
};
