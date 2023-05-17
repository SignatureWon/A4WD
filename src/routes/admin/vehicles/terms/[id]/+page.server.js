// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";

const keys = [
  "name",
  "suppliers",
  "booking_start",
  "booking_end",
  "travel_start",
  "travel_end",
  "percentage",
  "deposit",
  "balance",
  "reminder",
  "description",
  "payment2",
  "percentage2",
  "deposit2",
  "balance2",
  "reminder2",
  "description2",
  "payment3",
  "percentage3",
  "deposit3",
  "balance3",
  "reminder3",
  "description3",
  "description4",
  "confirmation",
  "confirmation_terms",
  "summary",
  "summary_terms",
  "counter",
  "counter_terms",
  "pay_counter",
];
export async function load({ url, params, locals }) {
  return {
    data: db.one({
      table: "terms",
      id: params.id,
      keys: keys,
    }),
    suppliers: db.related({
      table: "suppliers",
    }),
    path: url.pathname,
    id: params.id,
  };
}
export const actions = {
  insert: async ({ request, url, locals }) => {
    await db.actions.insert(request, url, locals, {
      table: "terms"
    })
  },
  update: async ({ request, url, params, locals }) => {
    await db.actions.update(request, url, locals, {
      id: params.id,
      table: "terms",
    })
  },
  delete: async ({ request, url, params, locals }) => {
    await db.actions.delete(request, url, locals, {
      id: params.id,
      table: "terms",
    })
  },
  duplicate: async ({ request, url, params, locals }) => {
    await db.actions.duplicate(request, url, locals, {
      id: params.id,
      table: "terms",
    })
  },
};
