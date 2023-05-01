import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "date_start", "date_end"];

  return {
    data: db.all({
      table: "addons",
      keys: keys,
      // eq: [{ name: "status", value: true }],
      order: [{ name: "date_start", ascend: true}]
    }),
    path: url.pathname,
  };
}
