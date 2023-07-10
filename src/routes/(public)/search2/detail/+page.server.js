import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { calculator } from "$lib/calculator";

export async function load({ url, params, locals }) {
  const { data: options, error } = await supabase.rpc("search_options").select();
  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs().format("YYYY-MM-DD"),
    date_end: dayjs().add(7, "day").format("YYYY-MM-DD"),
    license: "",
    age: "",
    category: "",
    pax: 2,
  };
  url.searchParams.forEach((value, key) => {
    if (key !== "selected") {
      if (["duration", "pax"].includes(key)) {
        search[key] = Number(value);
      } else {
        search[key] = value;
      }
    }
  });
  let selected = JSON.parse(url.searchParams.get("selected"));
  let details = await calculator.details(selected, search);

  return {
    options: options,
    search: JSON.parse(JSON.stringify(search)),
    details: details,
  };
}

export const actions = {
  default: async ({ request, url, locals }) => {
    const formData = await request.formData();
    let fd = Object.fromEntries(formData.entries());

    const { data: dataUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", fd.email)
      .single();

    console.log("fdfdfdfd", fd);


    // throw redirect(303, `/booking/success`);
  },
}
