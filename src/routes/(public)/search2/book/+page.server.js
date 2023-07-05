import { supabase } from "$lib/supabaseClient";
export async function load({ url, params, locals }) {
//   let detail = JSON.parse(url.searchParams.get("detail"));
//   console.log("detail", detail);

//   let postData = {};

// //   url.searchParams.forEach((value, key) => {
// //     postData[key] = value;
// //   });
//   let user = {
//     title: "",
//     first_name: "",
//     last_name: "",
//     phone: "",
//     email: postData.email,
//     address_1: "",
//     address_2: "",
//     postcode: "",
//     city: "",
//     state: "",
//     country: "",
//   };
//   const { data: dataUser } = await supabase
//     .from("users")
//     .select("id, title, first_name, last_name, phone, email, address_1, address_2, postcode, city, state, country")
//     .eq("email", postData.email)
//     .single();

//   // console.log("dataUser", dataUser);

//   if (dataUser) {
//     user = dataUser;
//   }

//   const { data: countries } = await supabase
//     .from("constants")
//     .select("id, name")
//     .eq("type", "countries")
//     .order("rank", { ascending: true });
//   return {
//     postData,
//     user,
//     countries,
//   };
}
