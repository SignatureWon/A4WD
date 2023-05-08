// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "suppliers",
  "calendar",
  "license",
  "age",
  // "nett",
  // "gross",
  // "tiers",
  "type",
  "date_start",
  "date_end",
];
export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "rates",
      id: params.id,
      keys: keys,
    }),
    suppliers: db.related({
      table: "suppliers",
    }),
    licenses: db.related({
      table: "constants",
      eq: [{ name: "type", value: "licenses" }],
    }),
    ages: db.related({
      table: "constants",
      eq: [{ name: "type", value: "ages" }],
    }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "rates",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "rates",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "rates",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "rates",
    });
  },
};
