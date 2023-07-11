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
    search[key] = value;
    // if (key !== "selected") {
    //   if (["duration", "pax"].includes(key)) {
    //     search[key] = Number(value);
    //   } else {
    //     search[key] = value;
    //   }
    // }
  });
  // let selected = JSON.parse(url.searchParams.get("selected"));
  // let details = await calculator.details(selected, search);
  let details = await calculator.single(search);

  //   console.log(bonds);

  return {
    options: options,
    search: JSON.parse(JSON.stringify(search)),
    // all: all_rates,
    // blocked: JSON.parse(JSON.stringify(blocked)),
    // selected: selected,
    details: JSON.parse(JSON.stringify(details)),
    // details: details,
    // specials: JSON.parse(JSON.stringify(specials)),
  };
}
