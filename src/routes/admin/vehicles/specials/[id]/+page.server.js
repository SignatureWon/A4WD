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
  "all_dropoffs",
  "all_vehicles",
  // "json_details",
  "type",
  "days",
  "value",
  "factor",
  "own",
  "discount2",
  "type2",
  "days2",
  "value2",
  "factor2",
  "own2",
  "image",
  "caption",
];
export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "specials",
      id: params.id,
      keys: keys,
    }),
    suppliers: db.related({
      table: "suppliers",
    }),
    depots: db.related({
      table: "depots",
    }),
    vehicles: db.related({
      table: "vehicles",
    }),
    suppliers_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "specials_suppliers",
            keys: ["suppliers"],
            eq: [{ name: "specials", value: params.id }],
          }),
    depots_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "specials_depots",
            keys: ["depots"],
            eq: [{ name: "specials", value: params.id }],
          }),
    dropoffs_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "specials_dropoffs",
            keys: ["dropoffs"],
            eq: [{ name: "specials", value: params.id }],
          }),
    vehicles_selected:
      params.id === "add"
        ? []
        : db.all({
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
