import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";

export async function load({ url, params, locals }) {
  let search = {};
  let detail = {};

  url.searchParams.forEach((value, key) => {
    if (["date_start", "date_end"].includes(key)) {
      value = dayjs(value);
    }
    search[key] = value;
  });
  const { data: ratesData, error: ratesError } = await cal.getRates(
    supabase,
    search
  );
  const { data: feesData, error: feesError } = await cal.getFees(
    supabase,
    search
  );
  const { data: blockoutsData, error: blockoutsError } = await cal.getBlockouts(
    supabase,
    search
  );
  const { data: specialsData, error: specialsError } = await cal.getSpecials(
    supabase,
    search
  );
  const { data: bondsData, error: bondsError } = await cal.getBonds(
    supabase,
    search
  );
  const { data: addonsData, error: addonsError } = await cal.getAddons(
    supabase,
    search
  );
  const { data: termsData, error: termsError } = await cal.getTerms(
    supabase,
    search
  );

  const filteredRoutes = cal.filterRoutes(ratesData, search);
  const arrangedRates = cal.arrangeRates(filteredRoutes, search);
  const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
  const addedFees = cal.addFees(filteredBlockouts, feesData);
  const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
  const addedBonds = cal.addBonds(addedSpecials, bondsData);
  const addAddons = cal.addAddons(addedBonds, addonsData);
  const addTerms = cal.addTerms(addAddons, termsData);
  // console.log("termsData", addTerms);

//   detail = addedSpecials[0];
  return {
    detail: JSON.parse(JSON.stringify(addTerms[0])),
    search: JSON.parse(JSON.stringify(search)),
  }
}
