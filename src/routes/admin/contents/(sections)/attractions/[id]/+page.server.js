// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "content",
  "image",
  "caption",
  "status",
  "rank",
  "description",
  "meta_description"
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "contents",
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
      table: "contents",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "contents",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "contents",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "contents",
    });
  },
};
