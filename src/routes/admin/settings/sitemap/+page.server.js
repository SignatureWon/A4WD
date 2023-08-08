import { supabase } from "$lib/supabaseClient";
export async function load({ url }) {
  const { data: sitemap } = await supabase.rpc("sitemaps");
  return { sitemap, path: url.pathname };
}
