// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "url",
  "phone",
  "status",
  "rank",
  "all_day",
  "start_time",
  "end_time",
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "suppliers",
      id: params.id,
      keys: keys,
    }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "suppliers",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "suppliers",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "suppliers",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "suppliers",
    });
  },
};
