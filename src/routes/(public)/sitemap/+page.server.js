import { supabase } from "$lib/supabaseClient";
export async function load({ url }) {
  const { data: sitemap } = await supabase.rpc("sitemaps");
  const { data: stat } = await supabase.from("constants").select("name").eq("type", "sitemap").single();
  return { sitemap, stat, path: url.pathname };
}
