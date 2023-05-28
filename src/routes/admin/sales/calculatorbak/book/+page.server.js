import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
  const { data: countries } = await supabase
    .from("constants")
    .select("id, name")
    .eq("type", "countries")
    .order("rank", { ascending: true });
  return { countries };
}
export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let postData = Object.fromEntries(formData.entries());

    let user = {
      first_name: "",
      last_name: "",
      phone: "",
      email: postData.email,
      country: "",
    }

    const { data: dataUser } = await supabase
      .from("users")
      .select("id, first_name, last_name, phone, email, country")
      .eq("email", postData.email).single();

    if (dataUser) {
      user = dataUser
    }
    return {
      postData, 
      user, 
    }
  },
};
