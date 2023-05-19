// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "first_name",
];
export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "profiles",
      id: params.id,
      keys: keys,
    }),
    path: url.pathname,
    type: params.type,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "profiles",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.updatePassword(request, url, locals, {
      id: params.id,
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "profiles",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "profiles",
    });
  },
};
