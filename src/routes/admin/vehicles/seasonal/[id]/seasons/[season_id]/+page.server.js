import { db } from "$lib/server/db";
export async function load({ url, params }) {
  let seasonal = await db.one.load({
    table: "rates",
    id: params.id,
    keys: ["name", "tiers", "suppliers"],
  });

  console.log("seasonal", seasonal);
  return {
    seasonal: seasonal,
    season: db.one.load({
      table: "ratesSeasons",
      id: params.season_id,
      keys: ["name", "rates", "date_start", "date_end", "tiers"],
    }),
    depots: db.related.load({
      table: "depots",
    }),
    vehicles: db.related.load({
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
    await db.actions.update(request, url, locals, {
      id: params.season_id,
      table: "ratesSeasons",
    });
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
