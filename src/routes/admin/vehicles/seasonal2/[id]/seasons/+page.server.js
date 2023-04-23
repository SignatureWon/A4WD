import { db } from "$lib/server/db";
export async function load({ url, params }) {
  return {
    data: db.one.load({
      table: "rates",
      id: params.id,
      keys: ["name"],
    }),
    seasons: db.all.load({
      table: "ratesSeasons",
      keys: ["id", "name"],
    }),

    path: url.pathname,
    id: params.id,
  };
  //   const { data, error } = await supabase
  //     .from("rates")
  //     .select("id, name, suppliers (name)");
  //   if (error) {
  //     throw error(404, {
  //       error,
  //     });
  //   }
  //   return { data, path: url.pathname };
}
