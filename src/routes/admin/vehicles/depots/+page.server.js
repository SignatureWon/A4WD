import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "code"];

  return {
    data: db.all({
      table: "depots",
      keys: keys,
      // eq: [{ name: "status", value: true }],
      // order: [{ name: "rank", ascend: true}]
    }),
    path: url.pathname,
  };
}
