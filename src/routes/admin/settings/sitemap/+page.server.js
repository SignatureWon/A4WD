import { supabase } from "$lib/supabaseClient";
export async function load({ url }) {
  const { data: sitemap } = await supabase.rpc("sitemaps");
  const { data: stat } = await supabase.from("constants").select("name").eq("type", "sitemap").single();
  return { sitemap, stat, path: url.pathname };
}
export const actions = {
  default: async ({ request, url, params, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());
    const { error: err } = await locals.sb.from("constants").update({
      name: fd.name
    }).eq("type", "sitemap");
  },
}