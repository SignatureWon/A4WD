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
  });

  // let results = {
  //   available: [],
  //   blocked: [],
  // };
  // if (search.pickup !== "" && search.dropoff !== "") {
  //   results = await calculator.search(search);
  // }

  return {
    options: options,
    search: JSON.parse(JSON.stringify(search)),
    // results: JSON.parse(JSON.stringify(results)),
  };
}
