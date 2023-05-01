// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "date_start",
  "date_end",
  "all_suppliers",
  "all_depots",
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "routes",
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
            table: "routes_suppliers",
            keys: ["suppliers"],
            eq: [{ name: "routes", value: params.id }],
          }),
    depots: db.related({
      table: "depots",
      eq: [{ name: "status", value: true }],
      order: [{ name: "rank", ascend: true }],
    }),
    depots_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "routes_depots",
            keys: ["depots"],
            eq: [{ name: "routes", value: params.id }],
          }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "routes",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "routes",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "routes",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "routes",
    });
  },
};
