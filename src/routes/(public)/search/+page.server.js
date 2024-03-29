import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { calculator } from "$lib/calculator";

export async function load({ url, params, locals }) {
  const { data: options, error } = await supabase.rpc("search_options").select();

  // let results = [];
  // let blocked = [];
  // let allRates = [];
  // let specials = [];

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
    // if (key === "date_start" || key === "date_end") {
    //   console.log(key, value);
    //   if (value.indexOf("/")) {
    //     value = dayjs(value, "DD/MM/YYYY").format("YYYY-MM-DD")
    //   }
    // }
    search[key] = value;
  });
  // let results = {
  //   available: [],
  //   blocked: [],
  // };
  // if (search.pickup !== "" && search.dropoff !== "") {
  //   results = await calculator.search(search);
  // }

  // let results = await calculator.search(search);

  // console.log("search", search);

  // let all_rates = {}
  // if (search.pickup !== "" && search.dropoff !== "") {
  // all_rates = calculator(search);
  // const { data: flexData } = await cal.getFlex(supabase, search);
  // const { data: seasonalData } = await cal.getSeasonal(supabase, search);
  // allRates = [...flexData, ...seasonalData];
  // const { data: feesData, error: feesError } = await cal.getFees(supabase, search);
  // const { data: blockoutsData, error: blockoutsError } = await cal.getBlockouts(supabase, search);
  // const { data: specialsData, error: specialsError } = await cal.getSpecials(supabase, search);
  // const { data: bondsData, error: bondsError } = await cal.getBonds(supabase, search);

  // const filteredRoutes = cal.filterRoutes(allRates, search);
  // const arrangedRates = cal.arrangeRates(filteredRoutes, search);
  // const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
  // const addedFees = cal.addFees(filteredBlockouts.rates, feesData);
  // const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
  // const addedBonds = cal.addBonds(addedSpecials, bondsData, search);

  // results = [...addedBonds];
  // blocked = [...filteredBlockouts.blocked];
  // specials = [...addedSpecials];
  // }
  return {
    options: options,
    search: JSON.parse(JSON.stringify(search)),
    // all: all_rates,
    // blocked: JSON.parse(JSON.stringify(blocked)),
    // results: JSON.parse(JSON.stringify(results)),
    // specials: JSON.parse(JSON.stringify(specials)),
  };
}
