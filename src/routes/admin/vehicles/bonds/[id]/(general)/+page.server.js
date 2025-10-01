// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "display_name",
  "code",
  "date_start",
  "date_end",
  "all_suppliers",
  "all_vehicles",
  "nett",
  "gross",
  "cap",
  "deposit",
  "liability",
  "bond",
  "waive_one_way",
  "description",
  "inclusions",
  "status",
  "rank",
  "min_days",
  "min_rate",
];

export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "packages",
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
            table: "packages_suppliers",
            keys: ["suppliers"],
            eq: [{ name: "packages", value: params.id }],
          }),
    vehicles: db.related({
      table: "vehicles",
      eq: [{ name: "status", value: true }],
      order: [{ name: "rank", ascend: true }],
    }),
    vehicles_selected:
      params.id === "add"
        ? []
        : db.all({
            table: "packages_vehicles",
            keys: ["vehicles"],
            eq: [{ name: "packages", value: params.id }],
          }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "packages",
    });
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "packages",
    });
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "packages",
    });
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "packages",
    });
  },
};
