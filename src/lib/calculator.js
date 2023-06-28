import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { supabase } from "$lib/supabaseClient";

const get_routes = (data, search) => {
  let results = [];
  data.forEach((item) => {
    const valid = item.routes.filter((route) => {
      return route.from.id === search.pickup && route.to.id === search.dropoff;
    });
    if (valid.length) {
      if (valid[0].active) {
        // console.log(valid[0]);
        item.routes = valid[0];
        item.min_days = valid[0].days || 0;
        item.one_way = valid[0].fee || 0;
        item.dropoff_id = valid[0].to.id;
        item.dropoff_name = valid[0].to.label || valid[0].to.name;
        item.duration = search.duration;

        // if (item.data_type === "seasonal") {
        //   item.daily = getSeasonalDaily(search.duration, item.tiers, item.min_days);
        // }

        results.push(item);
      }
    }
  });

  return results;
};

const get_flex = async (search) => {
    console.log("date_start", dayjs(search.date_start));
    console.log("date_end", dayjs(search.date_end));
  let query = supabase
    .rpc("get_rates")
    .gte("date_start", dayjs(search.date_start).subtract(7, "day"))
    .lte("date_end", dayjs(search.date_end).add(7, "day"))
    .eq("depot_id", search.pickup)
    .eq("rates_type", "flex");

  if (search.license !== "") {
    query = query.or(`license_id.eq.${search.license},license_id.is.null`);
  }
  if (search.category !== "") {
    query = query.contains("vehicles_categories", JSON.stringify([{ id: search.category }]));
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

  const { data, error } = await query;


  return data;
};
const get_seasonal = async (search) => {
  let query = supabase.rpc("get_rates").eq("depot_id", search.pickup).eq("rates_type", "seasonal");

  if (search.license !== "") {
    query = query.or(`license_id.eq.${search.license},license_id.is.null`);
  }

  if (search.category !== "") {
    query = query.contains("vehicles_categories", JSON.stringify([{ id: search.category }]));
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

  const { data, error } = await query;
  console.log("before", data);
    console.log("after", get_routes(data, search));
  
  return data;
};

export const calculator = async (search) => {
    console.log("search", search);
//   search.date_start = dayjs(search.date_start);
//   search.date_end = dayjs(search.date_end);

  search.duration = search.date_end.diff(search.date_start, "day") + 1;

  const flex = await get_flex(search);
  const seasonal = await get_seasonal(search);

//   console.log(seasonal);

  return {
    flex: "something",
  };
};
