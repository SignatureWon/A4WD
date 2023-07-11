import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
  const { data: options, error } = await supabase.rpc("search_options").select();
  return {
    options: options,
  };
}
