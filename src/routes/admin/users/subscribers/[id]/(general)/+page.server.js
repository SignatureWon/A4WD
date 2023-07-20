// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "id",
  "created_at",
  "email",
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "form_newsletter",
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
    await db.actions.insertProfile(request, url, locals, {
      table: "form_newsletter",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "form_newsletter",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "form_newsletter",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "form_newsletter",
    });
  },
};
