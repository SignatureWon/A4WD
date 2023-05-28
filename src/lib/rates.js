import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { supabase } from "$lib/supabaseClient";

const getFlex = (search) => {
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

  return query;
};
const getSeasonal = (search) => {
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

  return query;
};
const getFees = (search) => {
  // let query = supabase.from("fees").select()
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
    `date_start.lte.${search.date_start.format("YYYY-MM-DD")},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
  );
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);
  return query;
};
const getBlockouts = (search) => {
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
  return query;
};
const getSpecials = (search) => {
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
      description,
      id
  `);
  query = query.or(
    `travel_start.lte.${search.date_start.format("YYYY-MM-DD")},travel_end.gte.${search.date_end.format("YYYY-MM-DD")}`
  );
  query = query.lte("travel_start", search.date_end);
  query = query.gte("travel_end", search.date_start);
  query = query.or(`booking_start.lte.${dayjs().format("YYYY-MM-DD")},booking_end.gte.${dayjs().format("YYYY-MM-DD")}`);
  query = query.lte("booking_start", dayjs());
  query = query.gte("booking_end", dayjs());
  return query;
};
const getBonds = (search) => {
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
  query = query.or(
    `date_start.lte.${search.date_start.format("YYYY-MM-DD")},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
  );
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);
  query = query.eq("status", true);
  query = query.order("rank", { ascending: true });

  return query;
};
const getAddons = (search) => {
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
  query = query.or(
    `date_start.lte.${search.date_start.format("YYYY-MM-DD")},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
  );
  query = query.lte("date_start", search.date_end);
  query = query.gte("date_end", search.date_start);

  return query;
};
const getTerms = (search) => {
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
  query = query.or(
    `travel_start.lte.${search.date_start.format("YYYY-MM-DD")},travel_end.gte.${search.date_end.format("YYYY-MM-DD")}`
  );
  query = query.lte("travel_start", search.date_end);
  query = query.gte("travel_end", search.date_start);
  query = query.or(`booking_start.lte.${dayjs().format("YYYY-MM-DD")},booking_end.gte.${dayjs().format("YYYY-MM-DD")}`);
  query = query.lte("booking_start", dayjs());
  query = query.gte("booking_end", dayjs());

  // console.log(query);
  return query;
};
const filteredByRoutes = (rates, search) => {
  let results = [];
  const duration = search.date_end.diff(search.date_start, "day") + 1;

  rates.forEach((rate) => {
    const valid = rate.routes.filter((route) => {
      return route.from.id === search.pickup && route.to.id === search.dropoff;
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
};
const sortedByVehicles = (rates, search) => {
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
      let rateToday = {};

      // console.log(search.date_start, search.date_end);
      for (
        var d = new Date(search.date_start.$y, search.date_start.$M, search.date_start.$D);
        d <= new Date(search.date_end.$y, search.date_end.$M, search.date_end.$D);
        d.setDate(d.getDate() + 1)
      ) {
        const day = dayjs(d);
        // 7-day blocked, so change rate only after every 7th day
        if (day.diff(search.date_start, "day") % 7 === 0) {
          vehicles[id][rate].forEach((r) => {
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
const filteredByBlockouts = (rates, blockouts) => {
  let results = {
    available: [],
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
          if (bo.depots.id === rate.depot_id || bo.depots.id === rate.dropoff_id) {
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
      results.available.push(rate);
    }
  });
  // console.log("block", results);
  return results;
};
const addFees = (rates, fees) => {
  // let results = [];
  rates.forEach((rate) => {
    rate.fee_total = 0;
    rate.fee_items = [];
    fees.forEach((fee) => {
      let depots = fee.all_depots;
      let dropoffs = fee.all_dropoffs;
      let suppliers = fee.all_suppliers;
      let vehicles = fee.all_vehicles;

      if (!depots) {
        fee.fees_depots.forEach((obj) => {
          if (obj.depots.id === rate.depot_id) {
            depots = true;
          }
        });
      }
      if (!dropoffs) {
        fee.fees_dropoffs.forEach((obj) => {
          if (obj.dropoffs.id === rate.dropoff_id) {
            dropoffs = true;
          }
        });
      }
      if (!suppliers) {
        fee.fees_suppliers.forEach((obj) => {
          if (obj.suppliers.id === rate.supplier_id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        fee.fees_vehicles.forEach((obj) => {
          if (obj.vehicles.id === rate.vehicle_id) {
            vehicles = true;
          }
        });
      }
      if (depots || dropoffs) {
        if (suppliers) {
          if (vehicles) {
            rate.fee_total += fee.fee;
            rate.fee_items.push(fee);
          }
        }
      }
    });
  });
  // console.log("fees", rates);
  return rates;
};
const addSpecials = (rates, specials, search) => {
  const duration = search.date_end.diff(search.date_start, "day") + 1;
  rates.forEach((rate) => {
    rate.special_total = 0;
    rate.special_items = [];
    specials.forEach((special) => {
      // console.log("special", special);
      let depots = special.all_depots;
      let dropoffs = special.all_dropoffs;
      let suppliers = special.all_suppliers;
      let vehicles = special.all_vehicles;

      if (!depots) {
        special.specials_depots.forEach((obj) => {
          if (obj.depots.id === rate.depot_id) {
            depots = true;
          }
        });
      }
      if (!dropoffs) {
        special.specials_dropoffs.forEach((obj) => {
          if (obj.dropoffs.id === rate.dropoff_id) {
            dropoffs = true;
          }
        });
      }
      if (!suppliers) {
        special.specials_suppliers.forEach((obj) => {
          if (obj.suppliers.id === rate.supplier_id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        special.specials_vehicles.forEach((obj) => {
          if (obj.vehicles.id === rate.vehicle_id) {
            vehicles = true;
          }
        });
      }
      if (depots || dropoffs) {
        if (suppliers) {
          if (vehicles) {
            special.discount_amount = 0;
            special.discount_list = [];
            special.active = false;

            if (special.type === "Deduction") {
              special.active = true;
              let getDiscount = countDiscountAmount(
                special.type,
                special.factor,
                special.value,
                rate.gross,
                rate.daily,
                rate.one_way,
                rate.list,
                search.date_start
              );
              special.discount_amount = getDiscount.total;
            } else if (special.type === "Early bird") {
              if (search.date_start.diff(dayjs(), "day") > special.days) {
                special.active = true;
                let getDiscount = countDiscountAmount(
                  special.type,
                  special.factor,
                  special.value,
                  rate.gross,
                  rate.daily,
                  rate.one_way,
                  rate.list,
                  search.date_start
                );
                special.discount_amount = getDiscount.total;
              }
            } else if (special.type === "Long term") {
              if (duration > special.days) {
                special.active = true;
                let getDiscount = countDiscountAmount(
                  special.type,
                  special.factor,
                  special.value,
                  rate.gross,
                  rate.daily,
                  rate.one_way,
                  rate.list,
                  search.date_start
                );
                special.discount_amount = getDiscount.total;
                // special.discount_amount = countDiscountAmount(
                //   special.type2,
                //   special.factor,
                //   special.value,
                //   rate.gross,
                //   rate.daily,
                //   rate.one_way,
                //   rate.list,
                //   search.date_start
                // );
              }
            } else if (special.type === "Every X day") {
              special.discount_amount = 0;
              special.discount_list = [];
              special.active = true;
              rate.list.forEach((r, i) => {
                if (i > 0 && (i + 1) % 7 === 0) {
                  let getDiscount = countDiscountAmount(
                    special.type,
                    special.factor,
                    special.value,
                    r.gross,
                    r.gross,
                    rate.one_way,
                    rate.list,
                    search.date_start
                  );
                  special.discount_amount += getDiscount.total;
                  special.discount_list.push(getDiscount.items);
                }
              });
            }
            rate.special_total += special.discount_amount;
            rate.special_items.push(special);

            // console.log("rate", rate.special_total);

            if (special.discount2) {
              special.discount_amount2 = 0;
              special.discount_list2 = [];
              if (special.type2 === "Deduction") {
                let getDiscount = countDiscountAmount(
                  special.type2,
                  special.factor2,
                  special.value2,
                  rate.gross,
                  rate.daily,
                  rate.one_way,
                  rate.list,
                  search.date_start
                );
                special.discount_amount2 = getDiscount.total;
              } else if (special.type2 === "Early bird") {
                if (search.date_start.diff(dayjs(), "day") > special.days2) {
                  let getDiscount = countDiscountAmount(
                    special.type2,
                    special.factor2,
                    special.value2,
                    rate.gross,
                    rate.daily,
                    rate.one_way,
                    rate.list,
                    search.date_start
                  );
                  special.discount_amount2 = getDiscount.total;
                }
              } else if (special.type2 === "Long term") {
                if (duration > special.days2) {
                  let getDiscount = countDiscountAmount(
                    special.type2,
                    special.factor2,
                    special.value2,
                    rate.gross,
                    rate.daily,
                    rate.one_way,
                    rate.list,
                    search.date_start
                  );
                  special.discount_amount2 = getDiscount.total;
                }
              } else if (special.type2 === "Every X day") {
                rate.list.forEach((r, i) => {
                  if (i > 0 && (i + 1) % 7 === 0) {
                    let getDiscount = countDiscountAmount(
                      special.type2,
                      special.factor2,
                      special.value2,
                      r.gross,
                      r.gross,
                      rate.one_way,
                      rate.list,
                      search.date_start
                    );
                    // special.discount_amount2 +=
                    // special.discount_list2.push(r);
                    special.discount_amount2 += getDiscount.total;
                    special.discount_list2.push(getDiscount.items);
                  }
                });
              }
              rate.special_total += special.discount_amount2;
              // rate.special_items.push(special);
            }
          }
        }
      }
    });
  });
  // console.log("special", rates);

  return rates;
};
const addBonds = (rates, bonds) => {
  // let results = [];
  rates.forEach((rate) => {
    // rate.fee_total = 0;
    rate.bond_items = [];
    bonds.forEach((bond) => {
      let suppliers = bond.all_suppliers;
      let vehicles = bond.all_vehicles;

      if (!suppliers) {
        bond.packages_suppliers.forEach((obj) => {
          if (obj.suppliers.id === rate.supplier_id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        bond.packages_vehicles.forEach((obj) => {
          if (obj.vehicles.id === rate.vehicle_id) {
            vehicles = true;
          }
        });
      }
      if (suppliers) {
        if (vehicles) {
          rate.bond_items.push(bond);
        }
      }
    });
  });
  // console.log("fees", rates);
  return rates;
};
const addAddons = (rates, addons) => {
  // let results = [];
  rates.forEach((rate) => {
    // rate.fee_total = 0;
    rate.addon_items = [];
    addons.forEach((addon) => {
      let suppliers = addon.all_suppliers;
      let vehicles = addon.all_vehicles;

      if (!suppliers) {
        addon.addons_suppliers.forEach((obj) => {
          if (obj.suppliers.id === rate.supplier_id) {
            suppliers = true;
          }
        });
      }
      if (!vehicles) {
        addon.addons_vehicles.forEach((obj) => {
          if (obj.vehicles.id === rate.vehicle_id) {
            vehicles = true;
          }
        });
      }
      if (suppliers) {
        if (vehicles) {
          rate.addon_items.push(addon);
        }
      }
    });
  });
  // console.log("fees", rates);
  return rates;
};
const addTerms = (rates, terms) => {
  // let results = [];
  rates.forEach((rate) => {
    terms.forEach((term) => {
      // console.log(rate.supplier_id, term.suppliers);
      if (rate.supplier_id === term.suppliers.id) {
        rate.terms = term;
      }
    });
  });
  return rates;
};

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
const countDiscountAmount = (
  type,
  factor,
  value,
  gross,
  daily,
  one_way,
  list,
  start_date
) => {
  let results = {
    total: 0,
    items: [],
  };
  if (factor === "Percentage") {
    if (type === "Every X day") {
      list.forEach(item, (i) => {
        if (i > 0 && (i + 1) % 7 === 0) {
          let discount = (item.gross * value) / 100;
          results.total += discount;
          results.items.push({
            day: i + 1,
            date: start_date.add(i + 1, "day"),
            amount: discount,
          });
        }
      });
    } else {
      results.total = (gross * value) / 100;
    }
  } else if (factor === "Price") {
    if (type === "Every X day") {
      list.forEach(item, (i) => {
        if (i > 0 && (i + 1) % 7 === 0) {
          let discount = item.gross - value;
          results.total += discount;
          results.items.push({
            day: i + 1,
            date: start_date.add(i + 1, "day"),
            amount: discount,
          });
        }
      });
    } else {
      results.total = value;
    }
  } else if (factor === "Day") {
    if (type === "Every X day") {
      list.forEach((item, i) => {
        if (i > 0 && (i + 1) % 7 === 0) {
          let discount = item.gross;
          results.total += discount;
          results.items.push({
            day: i + 1,
            date: start_date.add(i + 1, "day"),
            amount: discount,
          });
        }
      });
    } else {
      results.total = daily * value;
    }
  } else if (factor === "No One Way Fee") {
    results.total = one_way;
  }
  // console.log("Discount results", results);
  return results;
};

export const cal = {
  getSearchQueries: (url) => {
    let search = {
      pickup: "",
      dropoff: "",
      date_start: dayjs().format("DD/MM/YYYY"),
      date_end: dayjs().add(7, "day").format("DD/MM/YYYY"),
      license: "",
      age: "",
      category: "",
      pax: 2,
      vehicle: "",
      rate: "",
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
    let results = {
      available: [],
      blocked: [],
    }
    if (search.pickup !== "" && search.dropoff !== "") {
      const { data: dataFlex, error: errFlex } = await getFlex(search);
      const { data: dataSeasonal, error: errSeasonal } = await getSeasonal(search);
      const dataRoutes = filteredByRoutes([...dataFlex, ...dataSeasonal], search)
      const dataVehicles = sortedByVehicles(dataRoutes, search);

      const { data: dataBlockouts, error: errBlockouts } = await getBlockouts(search);
      const dataRates = filteredByBlockouts(dataVehicles, dataBlockouts);

      const { data: dataFees, error: errFees } = await getFees(search);
      const addedFees = addFees(dataRates.available, dataFees);

      const { data: dataSpecials, error: errSpecials } = await getSpecials(search);
      const addedSpecials = addSpecials(addedFees, dataSpecials, search);

      const { data: dataBonds, error: errBonds } = await getBonds(search);
      const addedBonds = addBonds(addedSpecials, dataBonds, search);

      results = {
        available: [...addedBonds],
        blocked: [...dataRates.blocked],
      }
    }
    // console.log("resultsresultsresultsresultsresultsresultsresults", results);
    return results;
  },
};
