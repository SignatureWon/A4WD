import { redirect } from "@sveltejs/kit";

export async function load({ url }) {
  console.log("REDIRECTING");

  let search = [];

  url.searchParams.forEach((value, key) => {
    search.push(`${key}=${value}`)
  });

  throw redirect(
    301,
    `/admin/sales/calculator?${search.join("&")}`
  );
}
