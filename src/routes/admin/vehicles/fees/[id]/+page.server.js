// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "description",
  "date_start",
  "date_end",
  "all_suppliers",
  "all_vehicles",
  "all_depots",
  "pickup",
  "dropoff",
  "return",
  "fee",
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "fees",
      id: params.id,
      keys: keys,
    }),
    depots: db.related({
      table: "depots",
    }),
    depots_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "fees_depots",
            keys: ["depots"],
            eq: [{ name: "fees", value: params.id }],
          }),
    suppliers: db.related({
      table: "suppliers",
    }),
    suppliers_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "fees_suppliers",
            keys: ["suppliers"],
            eq: [{ name: "fees", value: params.id }],
          }),
    vehicles: db.related({
      table: "vehicles",
      eq: [{ name: "status", value: true }],
      order: [{ name: "rank", ascend: true }],
    }),
    vehicles_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "fees_vehicles",
            keys: ["vehicles"],
            eq: [{ name: "fees", value: params.id }],
          }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "fees",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "fees",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "fees",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "fees",
    });
  },
};
