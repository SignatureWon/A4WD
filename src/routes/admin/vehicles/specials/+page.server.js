import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "type", "travel_start", "travel_end"];

  return {
    data: db.all.load({
      table: "specials",
      keys: keys,
    }),
    path: url.pathname,
  };
}
