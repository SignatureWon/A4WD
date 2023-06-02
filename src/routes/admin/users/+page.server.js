import { db } from "$lib/server/db";
export async function load({ url, params }) {
  const keys = [
    "id",
    "created_at",
    "first_name",
    "last_name",
    "email",
    "phone",
    "country",
  ];
  return {
    data: db.all({
      table: "users",
      keys: keys,
      order: [{ name: "created_at", ascend: true }],
    }),
    path: url.pathname,
  };
}