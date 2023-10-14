// import { supabase } from "$lib/supabaseClient";
import { db } from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";

const keys = ["name", "nett", "gross", "fees", "suppliers"];
const generateRates = async (seasonal) => {
  let ratesList = [];

  (seasonal.fees || []).forEach((tier) => {
    tier.depots.forEach((depot) => {
      tier.vehicles.forEach((vehicle) => {
        ratesList.push({
          rates: seasonal.id,
          date_start: seasonal.date_start,
          date_end: seasonal.date_end,
          tiers: tier.tiers,
          depots: depot,
          vehicles: vehicle,
        });
      });
    });
  });

  return ratesList;
};

export async function load({ url, params, locals }) {
  let seasonal = await db.one({
    table: "rates",
    id: params.id,
    keys: keys,
  });

  return {
    data: seasonal,
    depots: db.related({
      table: "depots",
    }),
    vehicles: db.related({
      table: "vehicles",
      eq: [{ name: "suppliers", value: seasonal.suppliers }],
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
    const formData = await request.formData();
    let newData = Object.fromEntries(formData.entries());
    newData.fees = JSON.parse(newData.fees);

    await db.update(locals, {
      id: params.id,
      table: "rates",
      data: newData,
    });

    const seasonal = await db.one({
      table: "rates",
      id: params.id,
      keys: ["id", "date_start", "date_end", "fees"],
    });
    let rates = await generateRates(seasonal);

    await db.delete(locals, {
      table: "ratesCard",
      key: "rates",
      value: params.id,
    });

    await db.insert(locals, {
      table: "ratesCard",
      data: rates,
    });

    throw redirect(303, `${url.pathname}`);
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
