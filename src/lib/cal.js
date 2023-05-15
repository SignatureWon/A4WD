import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const getSeasonalDaily = (days, tiers, route_min_days) => {
  let daily = 0;
  let min_days =
    route_min_days > tiers[0].from ? route_min_days : tiers[0].from;
  tiers.forEach((t, i) => {
    if (i === 0) {
      if (min_days > days) {
        daily = (t.rate * min_days) / days;
      }
    }
    if (days >= t.from && days <= t.to) {
      daily = t.rate;
    }
  });
  return daily;
};

export const cal = {
  getRates: (supabase, search) => {
    let query = supabase.rpc("get_rates").select();

    query = query.or(
      `date_start.lte.${search.date_start.format(
        "YYYY-MM-DD"
      )},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
    );
    query = query.lte("date_start", search.date_end);
    query = query.gte("date_end", search.date_start);

    if (search.category !== "") {
      query = query.contains(
        "vehicles_categories",
        JSON.stringify([{ id: search.category }])
      );
    }
    if (search.license !== "") {
      query = query.or(`license_id.eq.${search.license},license_id.is.null`);
    }
    if (search.age !== "") {
      query = query.eq("age_id", search.age);
    }
    if (search.pickup !== "") {
      query = query.eq("depot_id", search.pickup);
      // query = query.eq("routes.from.id", search.pickup);
    }
    return query;
  },
  getFees: (supabase, search) => {
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
    query = query.or(
      `date_start.lte.${search.date_start.format(
        "YYYY-MM-DD"
      )},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
    );
    query = query.lte("date_start", search.date_end);
    query = query.gte("date_end", search.date_start);
    return query;
  },
  getBlockouts: (supabase, search) => {
    let query = supabase.from("blockouts").select(`
        blockouts_depots (depots(id, name)),
        blockouts_suppliers (suppliers(id, name)),
        blockouts_vehicles (vehicles(id, name)),
        all_depots, 
        all_suppliers, 
        all_vehicles,
        name, 
        id
    `);
    query = query.or(
      `date_start.lte.${search.date_start.format(
        "YYYY-MM-DD"
      )},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
    );
    query = query.lte("date_start", search.date_end);
    query = query.gte("date_end", search.date_start);
    query = query.eq("status", true);
    return query;
  },
  getSpecials: (supabase, search) => {
    let query = supabase.from("specials").select(`
        specials_depots (depots(id, name)),
        specials_dropoffs (dropoffs(id, name)),
        specials_suppliers (suppliers(id, name)),
        specials_vehicles (vehicles(id, name)),
        all_depots, 
        all_dropoffs, 
        all_suppliers, 
        all_vehicles,
        type,
        days,
        factor,
        value,
        type2,
        days2,
        factor2,
        value2,
        discount2,
        name, 
        id
    `);
    query = query.or(
      `travel_start.lte.${search.date_start.format(
        "YYYY-MM-DD"
      )},travel_end.gte.${search.date_end.format("YYYY-MM-DD")}`
    );
    query = query.lte("travel_start", search.date_end);
    query = query.gte("travel_end", search.date_start);
    query = query.or(
      `booking_start.lte.${dayjs().format(
        "YYYY-MM-DD"
      )},booking_end.gte.${dayjs().format("YYYY-MM-DD")}`
    );
    query = query.lte("booking_start", dayjs());
    query = query.gte("booking_end", dayjs());
    return query;
  },
  // getSeasonalDaily: (days, tiers, route_min_days) => {
  //   let daily = 0;
  //   let min_days =
  //     route_min_days > tiers[0].from ? route_min_days : tiers[0].from;
  //   tiers.forEach((t, i) => {
  //     if (i === 0) {
  //       if (min_days > days) {
  //         daily = (t.rate * min_days) / days;
  //       }
  //     }
  //     if (days >= t.from && days <= t.to) {
  //       daily = t.rate;
  //     }
  //   });
  //   return daily;
  // },
  filterRoutes: (rates, search) => {
    let results = [];
    const duration = search.date_end.diff(search.date_start, "day");

    rates.forEach((rate) => {
      const valid = rate.routes.filter((route) => {
        return (
          route.from.id === search.pickup && route.to.id === search.dropoff
        );
      });
      if (valid.length) {
        if (valid[0].active) {
          rate.routes = valid[0];
          rate.min_days = valid[0].days || 0;
          rate.one_way = valid[0].fee || 0;
          rate.dropoff_id = valid[0].to.id;
          rate.dropoff_name = valid[0].to.label || valid[0].to.name;
          rate.duration = duration;

          if (rate.rates_type === "seasonal") {
            rate.daily = getSeasonalDaily(duration, rate.tiers, rate.min_days);
          }

          results.push(rate);
        }
      }
    });

    return results;
  },
  arrangeRates: (rates, search) => {
    let vehicles = {};
    rates.forEach((rate) => {
      if (!(rate.vehicle_id in vehicles)) {
        vehicles[rate.vehicle_id] = {};
      }
      if (!(rate.rates_id in vehicles[rate.vehicle_id])) {
        vehicles[rate.vehicle_id][rate.rates_id] = [];
      }
      vehicles[rate.vehicle_id][rate.rates_id].push(rate);
    });

    let results = [];

    for (const id in vehicles) {
      for (const rate in vehicles[id]) {
        let rates = {
          ...vehicles[id][rate][0],
          list: [],
        };
        let nett = 0;
        let gross = 0;
        let profit = 0;
        let isAdded = false;
        for (
          var d = new Date(
            search.date_start.$y,
            search.date_start.$M,
            search.date_start.$D
          );
          d <=
          new Date(search.date_end.$y, search.date_end.$M, search.date_end.$D);
          d.setDate(d.getDate() + 1)
        ) {
          const day = dayjs(d);

          vehicles[id][rate].forEach((r) => {
            if (
              day.isBetween(dayjs(r.date_start), dayjs(r.date_end), "day", "[)")
            ) {
              isAdded = true;
              let todayNett = r.rates_nett * r.daily;
              let todayGross = r.rates_gross * r.daily;
              let todayProfit = todayGross - todayNett;
              nett += todayNett;
              gross += todayGross;
              profit += todayProfit;

              rates.list.push({
                day: day,
                nett: todayNett,
                gross: todayGross,
                profit: todayProfit,
              });
            }
          });
        }
        if (isAdded) {
          rates.nett = nett;
          rates.gross = gross;
          rates.profit = profit;
          results.push(rates);
        }
      }
    }
    return results;
  },
  filterBlockouts: (rates, blockouts) => {
    let results = [];
    rates.forEach((rate) => {
      let blocked = false;
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
              blocked = true;
            }
          }
        }
        if (!blocked) {
          results.push(rate);
        }
      });
    });
    return results;
  },
  addFees: (rates, fees) => {
    return rates
  },
  addSpecials: (rates, specials) => {
    return rates
  },


  // filterBlockouts: (vehicles, blockouts) => {
  //   let results = {};

  //   for (const id in vehicles) {
  //     let blocked = false;

  //     blockouts.forEach((blockout) => {
  //       for (const rate in vehicles[id]) {
  //         let blocked_depots = blockout.all_depots;
  //         let blocked_suppliers = blockout.all_suppliers;
  //         let blocked_vehicles = blockout.all_vehicles;

  //         if (!blocked_depots) {
  //           blockout.blockouts_depots.forEach((bo) => {
  //             if (
  //               bo.depots.id === vehicles[id][rate].depot_id ||
  //               bo.depots.id === vehicles[id][rate].dropoff_id
  //             ) {
  //               blocked_depots = true;
  //             }
  //           });
  //           blockout.blockouts_suppliers.forEach((bo) => {
  //             if (bo.suppliers.id === vehicles[id][rate].supplier_id) {
  //               blocked_suppliers = true;
  //             }
  //           });
  //           blockout.blockouts_vehicles.forEach((bo) => {
  //             if (bo.vehicles.id === vehicles[id][rate].vehicle_id) {
  //               blocked_vehicles = true;
  //             }
  //           });
  //         }
  //         if (blocked_depots) {
  //           if (blocked_suppliers) {
  //             if (blocked_vehicles) {
  //               blocked = true;
  //             }
  //           }
  //         }
  //       }
  //     });
  //     if (!blocked) {
  //       results[id] = vehicles[id];
  //     }
  //   }
  //   return results;
  // },
  arrangeRatesByVehicles: (rates) => {
    let results = {};
    rates.forEach((rate) => {
      if (!(rate.vehicle_id in results)) {
        results[rate.vehicle_id] = {};
      }
      if (!(rate.rates_id in results[rate.vehicle_id])) {
        results[rate.vehicle_id][rate.rates_id] = [];
      }
      results[rate.vehicle_id][rate.rates_id].push(rate);
    });
    return results;
  },
};
