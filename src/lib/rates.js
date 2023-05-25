import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { supabase } from "$lib/supabaseClient";

const queryFlex = (search) => {
  let query = supabase
    .rpc("get_rates")
    .gte("date_start", search.date_start.subtract(7, "day"))
    .lte("date_end", search.date_end.add(7, "day"))
    .eq("depot_id", search.pickup)
    .eq("rates_type", "flex");

  if (search.license !== "") {
    query = query.or(`license_id.eq.${search.license},license_id.is.null`);
  }

  if (search.category !== "") {
    query = query.contains(
      "vehicles_categories",
      JSON.stringify([{ id: search.category }])
    );
  }

  if (search.pax > 0) {
    query = query.gte("vehicle_pax", search.pax);
  }

  if (search.rates) {
    query = query.eq("rates_id", search.rates);
  }

  if (search.vehicle) {
    query = query.eq("vehicle_id", search.vehicle);
  }

  query = query
    .order("rates_id", { ascending: true })
    .order("vehicle_id", { ascending: true })
    .order("date_start", { ascending: true });

  return query;
};

export const cal = {
  getSearchQueries: (url) => {
    let search = {
      pickup: "",
      dropoff: "",
      date_start: dayjs(),
      date_end: dayjs().add(7, "day"),
      license: "",
      age: "",
    };
    url.searchParams.forEach((value, key) => {
      if (["date_start", "date_end"].includes(key)) {
        value = dayjs(value, "DD/MM/YYYY");
      }
      search[key] = value;
    });
    return search;
  },

  getSearchResults: async (search) => {
    let results = [];
    if (search.pickup !== "" && search.dropoff !== "") {
      const { data: dataFlex, error: errFlex } = await queryFlex(search);
      results = dataFlex;
      // get flex rates
    }
    return results;
  },
};
