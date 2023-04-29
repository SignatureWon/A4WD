// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "code",
  "suppliers",
  "age",
  "status",
  "rank",
  "image",
  "caption",
  "pax",
  "transmission",
  "wheel",
  "fuel",
  "shower",
  "toilet",
];
export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "vehicles",
      id: params.id,
      keys: keys,
    }),
    suppliers: db.related({
      table: "suppliers",
    }),
    categories: db.related({
      table: "categories",
    }),
    categories_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "vehicles_categories",
            keys: ["categories"],
            eq: [{ name: "vehicles", value: params.id }],
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
      table: "vehicles",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "vehicles",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "vehicles",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "vehicles",
    });
  },
};
