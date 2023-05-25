import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/rates";

export async function load({ url, params, locals }) {
  let search = cal.getSearchQueries(url)
  let results = cal.getSearchResults(search)

//   let results = [];
//   let blocked = [];
//   let allRates = [];
//   let specials = [];

  return {results};
}
