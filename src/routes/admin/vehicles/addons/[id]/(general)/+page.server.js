// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "date_start",
  "date_end",
  "all_suppliers",
  "all_vehicles",
  "link",
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "addons",
      id: params.id,
      keys: keys,
    }),
    suppliers: db.related({
      table: "suppliers",
    }),
    suppliers_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "addons_suppliers",
            keys: ["suppliers"],
            eq: [{ name: "addons", value: params.id }],
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
            table: "addons_vehicles",
            keys: ["vehicles"],
            eq: [{ name: "addons", value: params.id }],
          }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "addons",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "addons",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "addons",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "addons",
    });
  },
};
