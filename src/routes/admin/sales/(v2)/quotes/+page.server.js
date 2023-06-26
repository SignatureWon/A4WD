import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = ["id", "created_at", "details", "users (first_name, last_name)", "status"];

  return {
    data: db.all({
      table: "quotes",
      keys: keys,
      in: {
        name: "status",
        value: ["Request", "Booking", "Provisional", "Final"],
      },
      notNull: ["users"],
      order: [{ name: "created_at", ascend: false }],
    }),
    path: url.pathname,
  };
}
