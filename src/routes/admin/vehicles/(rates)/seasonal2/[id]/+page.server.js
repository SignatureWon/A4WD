// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "suppliers",
  "calendar",
  "license",
  "age",
  "nett",
  "gross",
  "fees",
  "type",
  "date_start",
  "date_end",
  "rank",
  "tiers_fixed",
];
export async function load({ url, params, locals }) {
  let seasonal = await db.one({
    table: "rates",
    id: params.id,
    keys: keys,
  });

  return {
    data: seasonal,
    suppliers: db.related({
      table: "suppliers",
    }),
    licenses: db.related({
      table: "constants",
      eq: [{ name: "type", value: "licenses" }],
    }),
    ages: db.related({
      table: "constants",
      eq: [{ name: "type", value: "ages" }],
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
  };
}
export const actions = {
  update: async ({ request, url, params, locals }) => {
    return true;
  },

  // insert: async ({ request, url, locals }) => {
  //   await db.actions.insert(request, url, locals, {
  //     table: "rates",
  //   });
  // },
  // update: async ({ request, url, params, locals }) => {
  //   await db.actions.update(request, url, locals, {
  //     id: params.id,
  //     table: "rates",
  //   });
  // },
  // delete: async ({ request, url, params, locals }) => {
  //   await db.actions.delete(request, url, locals, {
  //     id: params.id,
  //     table: "rates",
  //   });
  // },
  // duplicate: async ({ request, url, params, locals }) => {
  //   await db.actions.duplicate(request, url, locals, {
  //     id: params.id,
  //     table: "rates",
  //   });
  // },
};
