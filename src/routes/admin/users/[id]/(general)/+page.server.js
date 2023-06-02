import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "id",
  "created_at",
  "title",
  "first_name",
  "last_name",
  "email",
  "phone",
  "address_1",
  "address_2",
  "postcode",
  "city",
  "state",
  "country",
];

export async function load({ url, params, locals }) {
  const { data: dataOptions, error: errorOptions } = await supabase.rpc("search_options").select();
  let options = {
    depots: [],
    vehicles: [],
    ages: [],
    licenses: [],
    countries: [],
  };
  dataOptions.forEach((opt) => {
    options[opt.name] = opt.options;
  });

  return {
    data: db.one({
      table: "users",
      id: params.id,
      keys: keys,
    }),
    options: JSON.parse(JSON.stringify(options)),
    path: url.pathname,
    type: params.type,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insertProfile(request, url, locals, {
      table: "users",
    });
  },
  update: async ({ request, url, params, locals }) => {
    console.log("UPDATE");
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "users",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "users",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "users",
    });
  },
};
