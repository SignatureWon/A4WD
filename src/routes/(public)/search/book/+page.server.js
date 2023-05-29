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
      title: "",
      first_name: "",
      last_name: "",
      phone: "",
      email: postData.email,
      address_1: "",
      address_2: "",
      postcode: "",
      city: "",
      state: "",
      country: "",
    }

    const { data: dataUser } = await supabase
      .from("users")
      .select("id, title, first_name, last_name, phone, email, address_1, address_2, postcode, city, state, country")
      .eq("email", postData.email).single();

      // console.log("dataUser", dataUser);

    if (dataUser) {
      user = dataUser
    }
    return {
      postData, 
      user, 
    }
  },
};
