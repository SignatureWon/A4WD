// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "description",
  "booking_start",
  "booking_end",
  "travel_start",
  "travel_end",
  "all_suppliers",
  "all_depots",
  "all_vehicles",
  "json_details",
  "type",
];
export async function load({ url, params, locals }) {
  return {
    data: db.one.load({
      table: "specials",
      id: params.id,
      keys: keys,
    }),
    suppliers: db.related.load({
      table: "suppliers",
    }),
    depots: db.related.load({
      table: "depots",
    }),
    vehicles: db.related.load({
      table: "vehicles",
    }),
    suppliers_selected: db.all.load({
      table: "specials_suppliers",
      keys: ["suppliers"],
      eq: [{ name: "specials", value: params.id }],
    }),
    depots_selected: db.all.load({
      table: "specials_depots",
      keys: ["depots"],
      eq: [{ name: "specials", value: params.id }],
    }),
    vehicles_selected: db.all.load({
      table: "specials_vehicles",
      keys: ["vehicles"],
      eq: [{ name: "specials", value: params.id }],
    }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "specials",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "specials",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "specials",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "specials",
    });
  },
};
