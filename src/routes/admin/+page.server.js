import { supabase } from "$lib/supabaseClient";
export async function load() {
  const { data: stat } = await supabase.rpc("admin_data");
  return { stat };
}
