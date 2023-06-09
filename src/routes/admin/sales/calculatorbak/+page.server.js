import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/rates";
// import { cal } from "$lib/cal";

export async function load({ url, params, locals }) {
  let search = cal.getSearchQueries(url);
  let results = await cal.getSearchResults(search);

  return {
    search: JSON.parse(JSON.stringify(search)),
    results: JSON.parse(JSON.stringify(results)),
  };
  // let search = {
  //   pickup: "",
  //   dropoff: "",
  //   date_start: dayjs().format("DD/MM/YYYY"),
  //   date_end: dayjs().add(7, "day").format("DD/MM/YYYY"),
  //   license: "",
  //   age: "",
  //   category: "",
  //   pax: 2,
  // };

  // let results = [];
  // let blocked = [];
  // let allRates = [];

  // url.searchParams.forEach((value, key) => {
  //   if (["date_start", "date_end"].includes(key)) {
  //     value = dayjs(value, "DD/MM/YYYY");
  //   }
  //   search[key] = value;
  // });

  // if (search.pickup !== "" && search.dropoff !== "") {
  //   const { data: flexData } = await cal.getFlex(supabase, search);
  //   const { data: seasonalData } = await cal.getSeasonal(supabase, search);
  //   allRates = [...flexData, ...seasonalData];

  //   const { data: feesData, error: feesError } = await cal.getFees(
  //     supabase,
  //     search
  //   );
  //   const { data: blockoutsData, error: blockoutsError } =
  //     await cal.getBlockouts(supabase, search);

  //   const { data: specialsData, error: specialsError } = await cal.getSpecials(
  //     supabase,
  //     search
  //   );
  //   const { data: bondsData, error: bondsError } = await cal.getBonds(
  //     supabase,
  //     search
  //   );

  //   const filteredRoutes = cal.filterRoutes(allRates, search);
  //   const arrangedRates = cal.arrangeRates(filteredRoutes, search);
  //   const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
  //   const addedFees = cal.addFees(filteredBlockouts.rates, feesData);
  //   const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
  //   const addedBonds = cal.addBonds(addedSpecials, bondsData, search);

  //   results = [...addedBonds];
  //   blocked = [...filteredBlockouts.blocked]
  // }

  // return {
  //   blocked: JSON.parse(JSON.stringify(blocked)),
  //   search: JSON.parse(JSON.stringify(search)),
  //   results: JSON.parse(JSON.stringify(results)),
  // };
}
