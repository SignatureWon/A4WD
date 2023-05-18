import { redirect } from "@sveltejs/kit";

export async function load({ url }) {
//   let search = {};
  let search = [];

  url.searchParams.forEach((value, key) => {
    // search[key] = value;
    search.push(`${key}=${value}`)
  });

  throw redirect(
    301,
    `/search?${search.join("&")}`
    // `/search?date_start=${search.date_start}&date_end=${search.date_end}&age=${search.age}&license=${search.license}&pickup=${search.pickup}&dropoff=${search.dropoff}&dropoff=${search.dropoff}`
  );
  // return {};
}
