// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "id",
  "created_at",
  "title",
  "first_name",
  "last_name",
  "role",
  "email",
  "phone",
  "address_1",
  "address_2",
  "postcode",
  "city",
  "state",
  "country",
  "tnc",
  "newsletter",
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
    await db.actions.insertProfile(request, url, locals, {
      table: "profiles",
    });
  },
  update: async ({ request, url, params, locals }) => {
    console.log("UPDATE");
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "profiles",
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
