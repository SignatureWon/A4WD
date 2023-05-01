import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "name", "status", "rank"];

  return {
    data: db.all({
      table: "suppliers",
      keys: keys,
      // eq: [{ name: "status", value: true }],
      order: [{ name: "rank", ascend: true}]
    }),
    path: url.pathname,
  };
}
