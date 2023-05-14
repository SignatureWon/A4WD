import dayjs from "dayjs";
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
  getSeasonalDaily: (days, tiers, route_min_days) => {
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
  },
  checkBlockouts: (rate, blockouts) => {
    let block = {
      depot: false,
      supplier: false,
      vehicle: false,
    };

    blockouts.forEach((blockout) => {
      if (all_depots === true) {
        block.depot = true;
      } else {
        let depot = blockout.blockouts_depots.filter((bo) => {
          return bo.depots.id === rate.depot_id;
        });
        if (depot.length) {
          block.depot = true;
        }
      }
      if (all_suppliers === true) {
        block.supplier = true;
      } else {
        let supplier = blockout.blockouts_suppliers.filter((bo) => {
          return bo.suppliers.id === rate.supplier_id;
        });
        if (supplier.length) {
          block.supplier = true;
        }
      }
      if (all_vehicles === true) {
        block.vehicle = true;
      } else {
        let vehicle = blockout.blockouts_vehicles.filter((bo) => {
          return bo.vehicles.id === rate.vehicle_id;
        });
        if (vehicle.length) {
          block.vehicle = true;
        }
      }
    });
  },
};
