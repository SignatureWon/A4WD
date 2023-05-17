import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";

export async function load({ url, params, locals }) {
  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs(),
    date_end: dayjs().add(7, "day"),
    license: "",
    age: "",
  };
  let results = {};

  url.searchParams.forEach((value, key) => {
    if (["date_start", "date_end"].includes(key)) {
      value = dayjs(value, "DD/MM/YYYY");
    }
    search[key] = value;
  });

  if (search.pickup !== "" && search.dropoff !== "") {
    const { data: ratesData, error: ratesError } = await cal.getRates(
      supabase,
      search
    );
    // console.log(ratesData);
    const { data: feesData, error: feesError } = await cal.getFees(
      supabase,
      search
    );
    const { data: blockoutsData, error: blockoutsError } =
      await cal.getBlockouts(supabase, search);
      const { data: specialsData, error: specialsError } = await cal.getSpecials(
        supabase,
        search
      );
      const { data: bondsData, error: bondsError } = await cal.getBonds(
        supabase,
        search
      );
    // console.log(bondsData);
    
    const filteredRoutes = cal.filterRoutes(ratesData, search);
    const arrangedRates = cal.arrangeRates(filteredRoutes, search);
    const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
    const addedFees = cal.addFees(filteredBlockouts, feesData);
    const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
    const addedBonds = cal.addBonds(addedSpecials, bondsData, search);
    //   console.log(addedBonds);

    results = addedBonds;
  }

  //   detail = addedSpecials[0];
  return {
    search: JSON.parse(JSON.stringify(search)),
    results: JSON.parse(JSON.stringify(results)),
  };
}
