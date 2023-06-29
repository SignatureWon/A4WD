import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { supabase } from "$lib/supabaseClient";

const get_available_routes = (data, search) => {
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

        if (item.rates_type === "seasonal") {
          let daily = 0;
          let min_days = item.min_days > item.tiers[0].from ? item.min_days : item.tiers[0].from;
          item.tiers.forEach((t, i) => {
            if (i === 0) {
              if (min_days > search.duration) {
                daily = (t.rate * min_days) / search.duration;
              }
            }
            if (search.duration >= t.from && search.duration <= t.to) {
              daily = t.rate;
            }
          });

          item.daily = daily;
        }

        results.push(item);
      }
    }
  });

  return results;
};

const sort_rates_by_vehicle = (data) => {
  let results = {};
  data.forEach((item) => {
    if (!(item.vehicle_id in results)) {
      results[item.vehicle_id] = {};
    }
    if (!(item.rates_id in results[item.vehicle_id])) {
      results[item.vehicle_id][item.rates_id] = [];
    }
    results[item.vehicle_id][item.rates_id].push(item);
  });

  return results;
};

const convert_to_flex_rates = (data, search) => {
  let results = [];

  for (const id in data) {
    for (const rate in data[id]) {
      let rates = {
        ...data[id][rate][0],
        list: [],
      };
      let nett = 0;
      let gross = 0;
      let profit = 0;
      let isAdded = false;
      let rateToday = {};

      // console.log(search.date_start, search.date_end);
      for (var d = new Date(search.date_start); d <= new Date(search.date_end); d.setDate(d.getDate() + 1)) {
        const day = dayjs(d);
        // 7-day blocked, so change rate only after every 7th day
        if (day.diff(search.date_start, "day") % 7 === 0) {
          data[id][rate].forEach((r) => {
            if (day.isBetween(dayjs(r.date_start), dayjs(r.date_end), "day", "[)")) {
              isAdded = true;
              let todayNett = r.rates_nett * r.daily;
              let todayGross = r.rates_gross * r.daily;
              let todayProfit = todayGross - todayNett;

              rateToday = {
                day: day,
                nett: todayNett,
                gross: todayGross,
                profit: todayProfit,
                flex: r.flex,
              };

              // rates.list.push({
              //   day: day,
              //   nett: todayNett,
              //   gross: todayGross,
              //   profit: todayProfit,
              //   flex: r.flex,
              // });
            }
          });
        }
        rates.list.push(rateToday);
        nett += rateToday.nett;
        gross += rateToday.gross;
        profit += rateToday.profit;

        // console.log(day.format("DD/MM/YYYY"));
      }
      if (isAdded) {
        rates.nett = nett;
        rates.gross = gross;
        rates.profit = profit;
        results.push(rates);
      }
    }
  }
  // console.log("arrange", results);
  return results;
};

const convert_to_seasonal_rates = (data, search) => {
  // seasonal rates will get all available rates without filtering the date_start and date_end
  // all seasonal rates within a vehicle need to merge together
  // where all flex rates within a vehicle are individual rates
  let results = [];

  for (const id in data) {
    let rates = null;
    let nett = 0;
    let gross = 0;
    let profit = 0;
    let isAdded = false;
    let rateToday = {};
    for (var d = new Date(search.date_start); d <= new Date(search.date_end); d.setDate(d.getDate() + 1)) {
      const day = dayjs(d);

      for (const rate in data[id]) {
        let r = data[id][rate][0];
        if (!rates) {
          rates = {
            ...data[id][rate][0],
            list: [],
          };
        }
        if (day.isBetween(dayjs(r.date_start), dayjs(r.date_end), "day", "[)")) {
          isAdded = true;
          let todayNett = r.rates_nett * r.daily;
          let todayGross = r.rates_gross * r.daily;
          let todayProfit = todayGross - todayNett;

          rateToday = {
            day: day,
            nett: todayNett,
            gross: todayGross,
            profit: todayProfit,
            flex: r.flex,
          };
          rates.list.push(rateToday);
          nett += rateToday.nett;
          gross += rateToday.gross;
          profit += rateToday.profit;
        }
      }
    }
    if (isAdded) {
      rates.nett = nett;
      rates.gross = gross;
      rates.profit = profit;
      results.push(rates);
    }
  }
  // console.log("arrange", results);
  return results;
};

const get_flex = async (search) => {
  // console.log("date_start", dayjs(search.date_start));
  // console.log("date_end", dayjs(search.date_end));
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

  let available_rates = get_available_routes(data, search);
  let sorted_rates = sort_rates_by_vehicle(available_rates);
  let results = convert_to_flex_rates(sorted_rates, search);

  // console.log("sorted_rates", sorted_rates);
  // console.log("results", results);

  return results;
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

  let available_rates = get_available_routes(data, search);
  let sorted_rates = sort_rates_by_vehicle(available_rates);
  let results = convert_to_seasonal_rates(sorted_rates, search);

  // console.log("seasonal sorted_rates", sorted_rates);
  // console.log("seasonal results", results);

  return results;
};

const check_blockouts = async (rates, search) => {
  let query = supabase.from("blockouts").select(`
    blockouts_depots (depots(id, name)),
    blockouts_suppliers (suppliers(id, name)),
    blockouts_vehicles (vehicles(id, name)),
    all_depots, 
    all_suppliers, 
    all_vehicles,
    name,
    description,
    id
  `);
  query = query.or(
    `date_start.lte.${search.date_start.format("YYYY-MM-DD")},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
  );
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);
  query = query.eq("status", true);

  const { data, error } = await query;

  let results = {
    rates: [],
    blocked: [],
  };
  rates.forEach((rate) => {
    let blocked = false;
    rate.block_items = [];
    blockouts.forEach((blockout) => {
      let blocked_depots = blockout.all_depots;
      let blocked_suppliers = blockout.all_suppliers;
      let blocked_vehicles = blockout.all_vehicles;

      if (!blocked_depots) {
        blockout.blockouts_depots.forEach((bo) => {
          if (
            bo.depots.id === rate.depot_id ||
            bo.depots.id === rate.dropoff_id
          ) {
            blocked_depots = true;
          }
        });
      }
      if (!blocked_suppliers) {
        blockout.blockouts_suppliers.forEach((bo) => {
          if (bo.suppliers.id === rate.supplier_id) {
            blocked_suppliers = true;
          }
        });
      }
      if (!blocked_vehicles) {
        blockout.blockouts_vehicles.forEach((bo) => {
          if (bo.vehicles.id === rate.vehicle_id) {
            blocked_vehicles = true;
          }
        });
      }
      if (blocked_depots) {
        if (blocked_suppliers) {
          if (blocked_vehicles) {
            rate.block_items.push(blockout);
            blocked = true;
          }
        }
      }
    });
    if (blocked) {
      results.blocked.push(rate);
    } else {
      results.rates.push(rate);
    }
  });
  // console.log("block", results);
  return results;
};

export const calculator = async (search) => {
  // console.log("search", search);
  // search.date_start = dayjs(search.date_start);
  // search.date_end = dayjs(search.date_end);
  search.duration = dayjs(search.date_end).diff(dayjs(search.date_start), "day") + 1;

  const flex = await get_flex(search);
  const seasonal = await get_seasonal(search);
  const all_rates = [...flex, ...seasonal];

  // const blockouts = await check_blockouts(all_rates);

  // console.log("blockouts", blockouts);

  return {
    flex: "something",
  };
};
