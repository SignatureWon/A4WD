import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
  const { data: countries } = await supabase
    .from("constants")
    .select("id, name")
    .eq("type", "countries")
    .order("rank", { ascending: true });
  return {countries};
}
export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let detail = formData.get("detail");
    if (detail) {
      detail = JSON.parse(detail);
    }
    return detail;
    // let newData = Object.fromEntries(formData.entries());
  },
};
