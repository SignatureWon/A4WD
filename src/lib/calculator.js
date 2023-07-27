import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { supabase } from "$lib/supabaseClient";
import { format } from "$lib/format";
import { env } from "$env/dynamic/public";

const get_available_routes = (data, search, routes) => {
  let results = [];
  (routes || []).forEach((route) => {
    let supplier = route.all_suppliers;
    if (!supplier) {
      data.forEach((rate) => {
        // if (rate.supplier_id === '7e39ecef-91c4-442b-a996-57d71b8a036d') {
        //   console.log("ADV", rate);
        // }
        let filter_suppliers = route.routes_suppliers.filter((item) => {
          return item.suppliers.id === rate.supplier_id;
        });

        if (filter_suppliers.length) {
          // let depot = route.all_depots;
          // console.log("route.routes", route.routes.filter((r) => {
          //   return r.from.id === search.pickup && r.to.id === search.dropoff && r.active;
          // }));
          // if (!depot) {

          let valid = route.routes.filter((r) => {
            return r.from.id === search.pickup && r.to.id === search.dropoff && r.active;
          });
          // console.log("valid", valid);

          if (valid.length) {
            valid[0] = {
              ...valid[0],
              waive: route.waive,
              waive_days: route.waive_days,
            };
            rate.routes = valid[0];
            rate.min_days = valid[0].days || 0;
            rate.one_way = valid[0].fee || 0;
            rate.dropoff_id = valid[0].to.id;
            rate.dropoff_name = valid[0].to.label || valid[0].to.name;
            rate.duration = search.duration;

            // console.log("rate", rate);

            if (rate.rates_type === "seasonal") {
              let daily = 0;
              // let min_days = rate.min_days > rate.tiers[0].from ? rate.min_days : rate.tiers[0].from;
              rate.tiers.forEach((t, i) => {
                if (i === 0) {
                  // set first index as default rate
                  daily = t.rate;
                  // if (min_days > search.duration) {
                  //   daily = (t.rate * min_days) / search.duration;
                  // }
                }
                if (search.duration >= t.from && search.duration <= t.to) {
                  daily = t.rate;
                }
              });

              rate.daily = daily;
              // } else {
              //   console.log(rate.min_days, search.duration);
            }
            // console.log("rate");
            results.push(rate);
          }
          // }
        }
      });
    }
  });

  // data.forEach((item) => {
  //   if (!item.routes) {
  //     console.log("ERROR", item);
  //   }
  //   const valid = item.routes.filter((route) => {
  //     // console.log("routes", route.from.id, route.to.id);
  //     return route.from.id === search.pickup && route.to.id === search.dropoff;
  //   });
  //   if (valid.length) {
  //     if (valid[0].active) {
  //       // console.log(valid[0]);
  //       item.routes = valid[0];
  //       item.min_days = valid[0].days || 0;
  //       item.one_way = valid[0].fee || 0;
  //       item.dropoff_id = valid[0].to.id;
  //       item.dropoff_name = valid[0].to.label || valid[0].to.name;
  //       item.duration = search.duration;
  //       // item.date_start = search.date_start;
  //       // item.date_end = search.date_end;

  //       if (item.rates_type === "seasonal") {
  //         let daily = 0;
  //         let min_days = item.min_days > item.tiers[0].from ? item.min_days : item.tiers[0].from;
  //         item.tiers.forEach((t, i) => {
  //           if (i === 0) {
  //             if (min_days > search.duration) {
  //               daily = (t.rate * min_days) / search.duration;
  //             }
  //           }
  //           if (search.duration >= t.from && search.duration <= t.to) {
  //             daily = t.rate;
  //           }
  //         });

  //         item.daily = daily;
  //       }

  //       results.push(item);
  //     }
  //   }
  // });
  // console.log("routes", results);

  return results;
};
const sort_rates_by_vehicle = (data) => {
  let results = {};
  data.forEach((item) => {
    // console.log("item", item);

    if (!(item.vehicle_id in results)) {
      results[item.vehicle_id] = {};
    }
    if (!(item.rates_id in results[item.vehicle_id])) {
      results[item.vehicle_id][item.rates_id] = [];
    }
    results[item.vehicle_id][item.rates_id].push(item);
  });
  // console.log("sort", results);

  return results;
};
const convert_to_flex_rates = (data, search) => {
  let results = [];
  // console.log("data", data);

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
      let todayNett = 0;
      let todayGross = 0;
      let todayProfit = 0;
      let todayFlex = "";

      // console.log(search.date_start, search.date_end);
      for (var d = new Date(search.date_start); d <= new Date(search.date_end); d.setDate(d.getDate() + 1)) {
        const day = dayjs(d);
        // 7-day blocked, so change rate only after every 7th day
        if (day.diff(search.date_start, "day") % 7 === 0) {
          todayNett = 0;
          todayGross = 0;
          todayProfit = 0;
          todayFlex = "";

          data[id][rate].forEach((r) => {
            if (day.isBetween(dayjs(r.date_start), dayjs(r.date_end), "day", "[)")) {
              // isAdded = true;
              todayNett = r.rates_nett * r.daily;
              todayGross = r.rates_gross * r.daily;
              todayProfit = todayGross - todayNett;
              todayFlex = r.flex;

              // rateToday = {
              //   day: day,
              //   nett: todayNett,
              //   gross: todayGross,
              //   profit: todayProfit,
              //   flex: r.flex,
              // };

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
        if (todayNett > 0) {
          rateToday = {
            day: day.format("DD/MM/YYYY"),
            nett: todayNett,
            gross: todayGross,
            profit: todayProfit,
            flex: todayFlex,
          };
          rates.list.push(rateToday);
          nett += rateToday.nett;
          gross += rateToday.gross;
          profit += rateToday.profit;
        }
      }
      // console.log("rates.list", rates.list.length, rates.duration);

      if (rates.list.length === rates.duration) {
        rates.nett = nett;
        rates.gross = gross;
        rates.profit = profit;

        if (rates.list.length < rates.min_days) {
          let min_nett = (rates.list[0].nett * rates.min_days) / rates.list.length;
          let min_gross = (rates.list[0].gross * rates.min_days) / rates.list.length;
          let min_profit = min_gross - min_nett;

          rates.list.forEach((r) => {
            r.nett = min_nett;
            r.gross = min_gross;
            r.profit = min_profit;
          });

          rates.nett = min_nett * rates.list.length;
          rates.gross = min_gross * rates.list.length;
          rates.profit = min_profit * rates.list.length;
        }
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
    // let isAdded = false;
    let rateToday = {};
    for (var d = new Date(search.date_start); d <= new Date(search.date_end); d.setDate(d.getDate() + 1)) {
      const day = dayjs(d);
      let isAdded = false;

      for (const rate in data[id]) {
        let r = data[id][rate][0];
        if (!rates) {
          rates = {
            ...r,
            list: [],
          };
        }
        if (!isAdded) {
          let isCount = true;
          if (r.supplier_all_day) {
            isCount = day.isBefore(dayjs(search.date_end));
          }
          // console.log("day", day.format("YYYY-MM-DD"), dayjs(r.date_start).format("YYYY-MM-DD"), dayjs(r.date_end).format("YYYY-MM-DD"));

          if (day.isBetween(dayjs(r.date_start), dayjs(r.date_end), "day", "[]") && isCount) {
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
              name: r.rates_name,
            };

            rates.list.push(rateToday);
            nett += rateToday.nett;
            gross += rateToday.gross;
            profit += rateToday.profit;
          }
        }
      }
    }
    if (rates.supplier_all_day) {
      rates.duration = search.duration - 1;
      // console.log("rates", rates);
    }
    rates.nett = nett;
    rates.gross = gross;
    rates.profit = profit;
    // console.log("duration", rates.duration, "length", rates.list.length);

    if (rates.list.length === rates.duration) {
      if (rates.list.length < rates.min_days) {
        let min_nett = (rates.list[0].nett * rates.min_days) / rates.list.length;
        let min_gross = (rates.list[0].gross * rates.min_days) / rates.list.length;
        let min_profit = min_gross - min_nett;

        rates.list.forEach((r) => {
          r.nett = min_nett;
          r.gross = min_gross;
          r.profit = min_profit;
        });

        rates.nett = min_nett * rates.list.length;
        rates.gross = min_gross * rates.list.length;
        rates.profit = min_profit * rates.list.length;
      }
      results.push(rates);
    }
  }
  // console.log("arrange", results);
  return results;
};
const get_routes = async (search) => {
  let query = supabase.from("routes").select(`
  routes_suppliers (suppliers(id, name)),
  routes_depots (depots(id, name)),
  all_suppliers, 
  all_depots, 
  name, 
  waive,
  waive_days, 
  routes
`);
  query = query.or(`date_start.lte.${search.date_start},date_end.gte.${search.date_end}`);
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);
  query = query.eq("status", true);

  const { data, error } = await query;

  return data;
};
const get_flex = async (search, routes) => {
  // console.log("routes", routes);
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

  let available_rates = get_available_routes(data, search, routes);
  let sorted_rates = sort_rates_by_vehicle(available_rates);
  let results = convert_to_flex_rates(sorted_rates, search);

  // console.log("available_rates", data);
  // console.log("results", results);

  return results;
};
const get_seasonal = async (search, routes) => {
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
  // if (search.rates) {
  //   query = query.eq("rates_id", search.rates);
  // }
  if (search.vehicle) {
    query = query.eq("vehicle_id", search.vehicle);
  }

  query = query
    .order("rates_id", { ascending: true })
    .order("vehicle_id", { ascending: true })
    .order("date_start", { ascending: true });

  const { data, error } = await query;
  // console.log("seasonal", data);

  let available_rates = get_available_routes(data, search, routes);
  // console.log("available_rates", available_rates);
  let sorted_rates = sort_rates_by_vehicle(available_rates);

  // console.log("sorted_rates", sorted_rates);
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
  query = query.or(`date_start.lte.${search.date_start},date_end.gte.${search.date_end}`);
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
    data.forEach((item) => {
      let blocked_depots = item.all_depots;
      let blocked_suppliers = item.all_suppliers;
      let blocked_vehicles = item.all_vehicles;

      if (!blocked_depots) {
        item.blockouts_depots.forEach((bo) => {
          if (bo.depots.id === rate.depot_id || bo.depots.id === rate.dropoff_id) {
            blocked_depots = true;
          }
        });
      }
      if (!blocked_suppliers) {
        item.blockouts_suppliers.forEach((bo) => {
          if (bo.suppliers.id === rate.supplier_id) {
            blocked_suppliers = true;
          }
        });
      }
      if (!blocked_vehicles) {
        item.blockouts_vehicles.forEach((bo) => {
          if (bo.vehicles.id === rate.vehicle_id) {
            blocked_vehicles = true;
          }
        });
      }
      if (blocked_depots) {
        if (blocked_suppliers) {
          if (blocked_vehicles) {
            rate.block_items.push(item);
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
const check_every_x_day = (rate, special, pos = "") => {
  let item = {
    own: special[`own${pos}`],
    days: special[`days${pos}`],
    factor: special[`factor${pos}`],
    value: special[`value${pos}`] || 0,
    one_way: special[`one_way${pos}`] || 0,
  };
  const suffix = {
    0: "",
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th",
    6: "th",
    7: "th",
    8: "th",
    9: "th",
  };
  let result = {
    name: `Every ${item.days}${suffix[item.days.toString().slice(-1)]} day free`,
    calculation: "",
    discount_amount: 0,
    discount_nett: 0,
    discount_profit: 0,
  };
  let freeDay = [];

  rate.list.forEach((r, i) => {
    if (i > 0 && (i + 1) % item.days === 0) {
      result.discount_amount += r.gross;
      result.discount_nett += r.nett;
      result.discount_profit += r.profit;
      freeDay.push(`Day ${i + 1}: ${dayjs(r.day).format("DD MMM YYYY")} (-$${format.currency(r.gross)})`);
    }
  });
  result.calculation = freeDay.join("<br>");
  return result;
};
const check_percentage_price_oneway = (rate, special, pos = "") => {
  let item = {
    own: special[`own${pos}`],
    factor: special[`factor${pos}`],
    value: special[`value${pos}`] || 0,
    one_way: special[`one_way${pos}`] || 0,
  };
  let result = {
    name: "",
    calculation: "",
    discount_amount: 0,
    discount_nett: 0,
    discount_profit: 0,
  };
  if (item.factor === "Percentage") {
    result.name = `${item.value}% discount off daily vehicle rate only`;
    result.calculation = `($${format.currency(rate.gross)} x ${item.value}%)`;
    result.discount_amount = (rate.gross * item.value) / 100;
  } else if (item.factor === "Price") {
    result.name = `$${item.value} discount off daily vehicle rate only`;
    result.calculation = ``;
    result.discount_amount = item.value;
  } else if (item.factor === "No One Way Fee") {
    result.name = `No One Way Fee`;
    result.calculation = ``;
    result.discount_amount = item.one_way;
  }
  // console.log("own", item);
  if (item.own) {
    result.discount_profit += result.discount_amount; // deduct from commission
  } else {
    if (rate.rates_gross === 1) {
      result.discount_profit += result.discount_amount * (1 - rate.rates_nett);
      result.discount_nett += rate.nett - (rate.gross - result.discount_amount) * rate.rates_nett;
    } else if (rate.rates_nett === 1) {
      result.discount_profit += item.discount_amount * (rate.rates_gross - 1) * rate.rates_gross;
      result.discount_nett += result.discount_amount;
      //   item.discount_nett += rate.nett - ((rate.gross - item.discount_amount) * rate.rates_nett)
    }
  }
  return result;
};
const add_specials = (rate, item, spec) => {
  item.discount_list.push(spec);
  item.discount_amount += spec.discount_amount;
  if (item.own) {
    item.discount_profit += item.discount_amount; // deduct from commission
  } else {
    if (rate.rates_gross === 1) {
      item.discount_profit += item.discount_amount;
      item.discount_nett += item.discount_amount;
    } else if (rate.rates_nett === 1) {
      item.discount_nett += item.discount_amount;
    }
  }
};
const check_specials = async (rates, search) => {
  let query = supabase.from("specials").select(`
    *,
    specials_depots (depots(id, name)),
    specials_dropoffs (dropoffs(id, name)),
    specials_suppliers (suppliers(id, name)),
    specials_vehicles (vehicles(id, name))
  `);
  query = query.or(`travel_start.lte.${search.date_start},travel_end.gte.${search.date_end}`);
  query = query.lte("travel_start", search.date_end);
  query = query.gte("travel_end", search.date_start);
  query = query.or(`booking_start.lte.${dayjs().format("YYYY-MM-DD")},booking_end.gte.${dayjs().format("YYYY-MM-DD")}`);
  query = query.lte("booking_start", dayjs().format("YYYY-MM-DD"));
  query = query.gte("booking_end", dayjs().format("YYYY-MM-DD"));

  const { data, error } = await query;
  // console.log("specials", data);
  rates.forEach((rate) => {
    rate.special_total = 0;
    // console.log("rate", rate);

    rate.special_items = [];
    data.forEach((item) => {
      // console.log("item", item);

      let depots = item.all_depots;
      let dropoffs = item.all_dropoffs;
      let suppliers = item.all_suppliers;
      let vehicles = item.all_vehicles;
      let spec = {};

      if (!depots) {
        item.specials_depots.forEach((obj) => {
          if (obj.depots.id === rate.depot_id) {
            depots = true;
          }
        });
      }
      if (!dropoffs) {
        item.specials_dropoffs.forEach((obj) => {
          if (obj.dropoffs.id === rate.dropoff_id) {
            dropoffs = true;
          }
        });
      }
      if (!suppliers) {
        item.specials_suppliers.forEach((obj) => {
          if (obj.suppliers.id === rate.supplier_id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        item.specials_vehicles.forEach((obj) => {
          if (obj.vehicles.id === rate.vehicle_id) {
            vehicles = true;
          }
        });
      }
      if (depots || dropoffs) {
        if (suppliers) {
          if (vehicles) {
            item.discount_amount = 0;
            item.discount_nett = 0;
            item.discount_profit = 0;
            item.discount_list = [];
            item.active = false;
            spec = {};
            // console.log("rate", item, rate);

            switch (item.type) {
              case "Long term":
                if (rate.duration > item.days) {
                  item.active = true;
                  spec = check_percentage_price_oneway(rate, item);
                  add_specials(rate, item, spec);
                }
                break;
              case "Deduction":
                item.active = true;
                spec = check_percentage_price_oneway(rate, item);
                add_specials(rate, item, spec);
                break;
              case "Early bird":
                if (dayjs(search.date_start).diff(dayjs(), "day") > item.days) {
                  item.active = true;
                  spec = check_percentage_price_oneway(rate, item);
                  add_specials(rate, item, spec);
                }
                break;
              case "Every X day":
                if (rate.duration > item.days) {
                  item.active = true;
                  spec = check_every_x_day(rate, item);
                  // console.log(spec);
                  add_specials(rate, item, spec);
                }
                break;

              default:
                break;
            }
            if (item.discount2) {
              switch (item.type2) {
                case "Long term":
                  if (rate.duration > item.days2) {
                    spec = check_percentage_price_oneway(rate, item, 2);
                    // add_specials(rate, item, spec);
                  }

                  break;
                case "Deduction":
                  spec = check_percentage_price_oneway(rate, item, 2);
                  // add_specials(rate, item, spec);
                  break;
                case "Early bird":
                  if (dayjs(search.date_start).diff(dayjs(), "day") > item.days2) {
                    spec = check_percentage_price_oneway(rate, item, 2);
                    // add_specials(rate, item, spec);
                  }
                  break;
                case "Every X day":
                  if (rate.duration > item.days2) {
                    spec = check_every_x_day(rate, item, 2);
                    // add_specials(rate, item, spec);
                  }
                  break;

                default:
                  break;
              }
            }
            // console.log({
            //   rate: rate,
            //   item: item
            // });
            rate.special_total += item.discount_amount;
            rate.special_items = [...rate.special_items, item];
          }
        }
      }
    });
  });
  // console.log("special", rates);

  return rates;
};
const check_bonds = async (selected, search) => {
  // console.log("selected", selected);
  let query = supabase.from("packages").select(`
  packages_suppliers (suppliers(id, name)),
  packages_vehicles (vehicles(id, name)),
  all_suppliers, 
  all_vehicles, 
  display_name, 
  id, 
  nett,
  gross,
  cap,
  deposit,
  liability,
  bond,
  waive_one_way,
  description,
  inclusions
`);
  query = query.or(`date_start.lte.${search.date_start},date_end.gte.${search.date_end}`);
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);
  query = query.eq("status", true);
  query = query.order("rank", { ascending: true });

  const { data, error } = await query;

  if (!selected) {
    selected = {};
  }

  // rates.forEach((rate) => {
  // rate.fee_total = 0;
  selected.bond_items = [];
  data.forEach((bond) => {
    let suppliers = bond.all_suppliers;
    let vehicles = bond.all_vehicles;

    if (!suppliers) {
      bond.packages_suppliers.forEach((obj) => {
        if (obj.suppliers.id === selected.supplier_id) {
          suppliers = true;
        }
      });
    }
    if (!vehicles) {
      bond.packages_vehicles.forEach((obj) => {
        if (obj.vehicles.id === selected.vehicle_id) {
          vehicles = true;
        }
      });
    }
    if (suppliers) {
      if (vehicles) {
        selected.bond_items.push(bond);
      }
    }
  });
  // });
  // console.log("fees", rates);
  return selected;
};
const check_fees = async (selected, search) => {
  let query = supabase.from("fees").select(`
    fees_depots (depots(id, name)),
    fees_dropoffs (dropoffs(id, name)),
    fees_suppliers (suppliers(id, name)),
    fees_vehicles (vehicles(id, name)),
    all_depots, 
    all_dropoffs, 
    all_suppliers, 
    all_vehicles, 
    name, 
    id, 
    fee
  `);
  query = query.or(`date_start.lte.${search.date_start},date_end.gte.${search.date_end}`);
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);

  const { data, error } = await query;

  // rates.forEach((rate) => {
  selected.fee_total = 0;
  selected.fee_items = [];
  data.forEach((fee) => {
    let depots = fee.all_depots;
    let dropoffs = fee.all_dropoffs;
    let suppliers = fee.all_suppliers;
    let vehicles = fee.all_vehicles;

    if (!depots) {
      fee.fees_depots.forEach((obj) => {
        if (obj.depots.id === selected.depot_id) {
          depots = true;
        }
      });
    }
    if (!dropoffs) {
      fee.fees_dropoffs.forEach((obj) => {
        if (obj.dropoffs.id === selected.dropoff_id) {
          dropoffs = true;
        }
      });
    }
    if (!suppliers) {
      fee.fees_suppliers.forEach((obj) => {
        if (obj.suppliers.id === selected.supplier_id) {
          suppliers = true;
        }
      });
    }
    if (!vehicles) {
      fee.fees_vehicles.forEach((obj) => {
        if (obj.vehicles.id === selected.vehicle_id) {
          vehicles = true;
        }
      });
    }
    if (depots || dropoffs) {
      if (suppliers) {
        if (vehicles) {
          selected.fee_total += fee.fee;
          // selected.gross += fee.fee;
          selected.fee_items.push(fee);
        }
      }
    }
  });
  // });
  return selected;
};
const check_addons = async (selected, search) => {
  let query = supabase.from("addons").select(`
  addons_suppliers (suppliers(id, name)),
  addons_vehicles (vehicles(id, name)),
  all_suppliers, 
  all_vehicles, 
  name, 
  description, 
  link, 
  id, 
  addons
`);
  query = query.or(`date_start.lte.${search.date_start},date_end.gte.${search.date_end}`);
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);

  const { data, error } = await query;

  selected.addon_items = [];
  data.forEach((addon, i1) => {
    let suppliers = addon.all_suppliers;
    let vehicles = addon.all_vehicles;

    if (!suppliers) {
      addon.addons_suppliers.forEach((obj) => {
        if (obj.suppliers.id === selected.supplier_id) {
          suppliers = true;
        }
      });
    }
    if (!vehicles) {
      addon.addons_vehicles.forEach((obj) => {
        if (obj.vehicles.id === selected.vehicle_id) {
          vehicles = true;
        }
      });
    }
    if (suppliers) {
      if (vehicles) {
        addon.addons.forEach((obj, i2) => {
          obj.id = `${i1}-${i2}`;
          obj.selected = false;
          obj.gross = obj.daily ? obj.gross_rate * search.duration : obj.gross_rate;
          obj.nett = obj.daily ? obj.nett_rate * search.duration : obj.nett_rate;

          if (obj.gross > obj.gross_cap && obj.gross_cap > 0) {
            obj.gross = obj.gross_cap;
          }
          if (obj.nett > obj.nett_cap && obj.nett_cap > 0) {
            obj.nett = obj.nett_cap;
          }
          selected.addon_items.push(obj);
          // addons = [...addons, obj];
        });

        // selected.addon_items.push(addon);
      }
    }
  });
  return selected;
};
const check_terms = async (selected, search) => {
  let query = supabase.from("terms").select(`
  suppliers (id, name),
  name, 
  id,
  confirmation,
  confirmation_terms,
  summary,
  summary_terms,
  counter,
  counter_terms,
  deposit,
  percentage,
  balance,
  description,
  payment2,
  deposit2,
  percentage2,
  balance2,
  description2,
  payment3,
  deposit3,
  percentage3,
  balance3,
  description3,
  pay_counter
`);
  query = query.or(`travel_start.lte.${search.date_start},travel_end.gte.${search.date_end}`);
  query = query.lte("travel_start", search.date_end);
  query = query.gte("travel_end", search.date_start);
  query = query.or(`booking_start.lte.${dayjs().format("YYYY-MM-DD")},booking_end.gte.${dayjs().format("YYYY-MM-DD")}`);
  query = query.lte("booking_start", dayjs().format("YYYY-MM-DD"));
  query = query.gte("booking_end", dayjs().format("YYYY-MM-DD"));

  const { data, error } = await query;

  // console.log("terms", data);

  data.forEach((term) => {
    if (selected.supplier_id === term.suppliers.id) {
      selected.terms = term;
    }
  });
  return selected;
};

export const calculator = {
  details: async (selected, search) => {
    const bonds = await check_bonds(selected, search);
    const fees = await check_fees(bonds, search);
    const addons = await check_addons(fees, search);
    const d = await check_terms(fees, search);

    const details = {
      date_issue: dayjs().format("YYYY-MM-DD"),
      date_book: dayjs().format("YYYY-MM-DD"),
      date_start: search.date_start,
      date_end: search.date_end,
      pax: search.pax,
      duration: d.duration,
      min_days: d.min_days,
      rates_type: d.rates_type,
      rates_nett: d.rates_nett,
      rates_gross: d.rates_gross,
      rates: {
        id: d.rates_id,
        name: d.rates_name,
        type: d.rates_type,
        nett: d.rates_nett,
        gross: d.rates_gross,
      },
      pickup: {
        id: d.depot_id,
        name: d.depot_name,
      },
      dropoff: {
        id: d.dropoff_id,
        name: d.dropoff_name,
      },
      vehicle: {
        id: d.vehicle_id,
        name: d.vehicle_name,
        image: `${env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/${d.vehicle_image}?width=600&height=600&resize=contain`,
        excerpt: d.vehicle_excerpt,
        slug: d.vehicle_slug,
        fuel: d.vehicle_fuel,
        pax: d.vehicle_pax,
        shower: d.vehicle_shower,
        toilet: d.vehicle_toilet,
        wheel: d.vehicle_wheel,
        transmission: d.vehicle_transmission,
      },
      supplier: {
        id: d.supplier_id,
        name: d.supplier_name,
        all_day: d.supplier_all_day,
        start_time: d.supplier_start_time,
        end_time: d.supplier_end_time,
      },
      age: {
        id: d.age_id,
        name: d.age_name,
      },
      license: {
        id: d.license_id,
        name: d.license_name,
      },
      daily: {
        gross: d.gross,
        nett: d.nett,
        profit: d.profit,
        items: d.list,
      },
      fees: {
        total: d.fee_total,
        items: d.fee_items,
      },
      one_way: d.one_way,
      specials: {
        total: d.special_total,
        items: d.special_items,
      },
      bonds: {},
      bond_items: d.bond_items,
      addons: {},
      addon_items: d.addon_items,
      terms: d.terms,
    };

    return details;
  },
  single: async (search) => {
    search.duration = dayjs(search.date_end).diff(dayjs(search.date_start), "day") + 1;
    const routes = await get_routes(search);
    let this_rate = [];
    if (search.type === "flex") {
      this_rate = await get_flex(search, routes);
    } else {
      this_rate = await get_seasonal(search, routes);
    }
    // console.log("this_rate", this_rate);
    const { rates, blocked } = await check_blockouts(this_rate, search);
    const specials = await check_specials(rates, search);

    const bonds = await check_bonds(specials[0], search);
    const fees = await check_fees(bonds, search);
    const addons = await check_addons(fees, search);
    const d = await check_terms(fees, search);

    const details = {
      date_issue: dayjs().format("YYYY-MM-DD"),
      date_book: dayjs().format("YYYY-MM-DD"),
      date_start: search.date_start,
      date_end: search.date_end,
      pax: search.pax,
      duration: d.duration,
      min_days: d.min_days,
      rates_type: d.rates_type,
      rates_nett: d.rates_nett,
      rates_gross: d.rates_gross,
      rates: {
        id: d.rates_id,
        name: d.rates_name,
        type: d.rates_type,
        nett: d.rates_nett,
        gross: d.rates_gross,
      },
      pickup: {
        id: d.depot_id,
        name: d.depot_name,
      },
      dropoff: {
        id: d.dropoff_id,
        name: d.dropoff_name,
      },
      vehicle: {
        id: d.vehicle_id,
        name: d.vehicle_name,
        image: `${env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/${d.vehicle_image}?width=600&height=600&resize=contain`,
        excerpt: d.vehicle_excerpt,
        slug: d.vehicle_slug,
        fuel: d.vehicle_fuel,
        pax: d.vehicle_pax,
        shower: d.vehicle_shower,
        toilet: d.vehicle_toilet,
        wheel: d.vehicle_wheel,
        transmission: d.vehicle_transmission,
      },
      supplier: {
        id: d.supplier_id,
        name: d.supplier_name,
        all_day: d.supplier_all_day,
        start_time: d.supplier_start_time,
        end_time: d.supplier_end_time,
      },
      age: {
        id: d.age_id,
        name: d.age_name,
      },
      license: {
        id: d.license_id,
        name: d.license_name,
      },
      daily: {
        gross: d.gross,
        nett: d.nett,
        profit: d.profit,
        items: d.list,
      },
      fees: {
        total: d.fee_total,
        items: d.fee_items,
      },
      one_way: d.one_way,
      specials: {
        total: d.special_total,
        items: d.special_items,
      },
      bonds: {},
      bond_items: d.bond_items,
      addons: {},
      addon_items: d.addon_items,
      terms: d.terms,
    };
    // console.log("details", details);

    return details;
  },

  search: async (search) => {
    search.duration = dayjs(search.date_end).diff(dayjs(search.date_start), "day") + 1;
    // console.log("search.duration", search);

    const routes = await get_routes(search);
    // console.log("routesroutesroutesroutes", routes);

    const flex = await get_flex(search, routes);
    const seasonal = await get_seasonal(search, routes);
    const all_rates = [...flex, ...seasonal];
    // console.log("all_rates", all_rates);

    const { rates, blocked } = await check_blockouts(all_rates, search);
    const specials = await check_specials(rates, search);

    specials.sort((a, b) => {
      return a.gross - b.gross;
    });

    // let s = specials[1].special_items[0];
    // console.log("discount_amount", s.discount_amount);
    // console.log("discount_nett", s.discount_nett);
    // console.log("discount_profit", s.discount_profit);
    // console.log("specials_amount", s.discount_list[0].discount_amount);
    // console.log("specials_nett", s.discount_list[0].discount_nett);
    // console.log("specials_profit", s.discount_list[0].discount_profit);
    // console.log("specials_name", s.discount_list[0].name);
    // console.log("specials_calculation", s.discount_list[0].calculation);

    return {
      available: specials,
      blocked: blocked,
    };
  },
  group_rates: (rate) => {
    const daily = rate.daily.items;
    const rateType = rate.rates_type;
    let list = [];

    if (rateType === "flex") {
      let week = 1;
      let day = 0;
      daily.forEach((o, i) => {
        if (i !== 0 && i % 7 === 0) {
          list.push({
            name: `Daily basic rental: Week ${week}: Flex[${daily[i - 1].flex}]: $${format.currency(
              daily[i - 1].gross
            )} x ${day} days`,
            total: daily[i - 1].gross * day,
            nett: daily[i - 1].nett * day,
            profit: daily[i - 1].profit * day,
            week: week,
            days: day,
            flex: daily[i - 1].flex,
            daily: {
              gross: daily[i - 1].gross,
              nett: daily[i - 1].nett,
              profit: daily[i - 1].profit,
            },
          });
          day = 1;
          week++;
        } else {
          day++;
        }
        if (i === daily.length - 1) {
          list.push({
            name: `Daily basic rental: Week ${week}: Flex[${o.flex}]: $${format.currency(o.gross)} x ${day} days`,
            total: o.gross * day,
            nett: o.nett * day,
            profit: o.profit * day,
            week: week,
            days: day,
            flex: o.flex,
            daily: {
              gross: o.gross,
              nett: o.nett,
              profit: o.profit,
            },
          });
        }
      });
    } else {
      let days = 0;
      let rate_name = null;
      let gross = null;
      let nett = null;
      let profit = null;
      // console.log("rate", rate);
      (daily || []).forEach((o, i) => {
        // console.log("o", o.name);
        if (!gross) {
          rate_name = o.name;
          gross = o.gross;
          nett = o.nett;
          profit = o.profit;
        }
        if (gross === o.gross) {
          days++;
        }
        if (gross !== o.gross || i + 1 === daily.length) {
          list.push({
            name: `Daily basic rental: ${rate_name}: $${format.currency(gross)} x ${days} days`,
            total: gross * days,
            nett: nett * days,
            profit: profit * days,
            week: null,
            days: days,
            flex: null,
            daily: {
              gross: gross,
              nett: nett,
              profit: profit,
            },
          });
          days = 1;
          rate_name = o.name;
          gross = o.gross;
          nett = o.nett;
          profit = o.profit;
        }
      });
    }
    return list;
  },
};
