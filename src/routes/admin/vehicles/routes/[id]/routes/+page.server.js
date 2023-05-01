// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = ["name", "routes"];
export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "routes",
      id: params.id,
      keys: keys,
    }),
    depots: db.all({
      table: "routes_depots",
      keys: ["depots (id, code, name)", "routes"],
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
