import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export async function load({ url, params }) {
  let seasonal = await db.one({
    table: "rates",
    id: params.id,
    keys: ["name", "tiers", "suppliers"],
  });

  return {
    seasonal: seasonal,
    season: db.one({
      table: "ratesSeasons",
      id: params.season_id,
      keys: ["name", "rates", "date_start", "date_end", "tiers"],
    }),
    depots: db.related({
      table: "depots",
    }),
    vehicles: db.related({
      table: "vehicles",
      eq: [{ name: "suppliers", value: seasonal.suppliers }],
    }),
    path: url.pathname,
    id: params.id,
    season_id: params.season_id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "ratesSeasons",
    });
  },
  update: async ({ request, url, params, locals }) => {
    const resp = await db.actions.update(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });

    let ratesList = [];

    let objSeason = {
      rates: resp.rates,
      ratesSeasons: params.season_id,
      date_start: resp.date_start,
      date_end: resp.date_end,
    };
    resp.tiers.forEach((tier) => {
      let objAddRates = objSeason;
      objAddRates.daily = tier.daily;
      objAddRates.tiers = tier.tiers;
      tier.depots.forEach((depot) => {
        let objAddDepot = objAddRates;
        objAddDepot.depots = depot;
        tier.vehicles.forEach((vehicle) => {
          let objAddVehicle = objAddDepot;
          objAddVehicle.vehicles = vehicle;
          ratesList.push(objAddVehicle);
        });
      });
    });

    await db.delete(locals, {
      table: "ratesList",
      key: "ratesSeasons",
      value: params.season_id,
    });

    await db.insert(locals, {
      table: "ratesList",
      data: ratesList,
    });

    // console.log("resp", resp);
    // console.log("ratesBuilder", ratesBuilder);

    throw redirect(303, url.pathname);
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });
  },
};
