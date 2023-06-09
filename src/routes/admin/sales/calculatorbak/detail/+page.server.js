import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";

export async function load({ url, params, locals }) {
  let search = {};
  let allRates = [];

  url.searchParams.forEach((value, key) => {
    if (["date_start", "date_end"].includes(key)) {
      value = dayjs(value);
    }
    search[key] = value;
  });
  const { data: flexData } = await cal.getFlex(supabase, search);

  const { data: seasonalData } = await cal.getSeasonal(supabase, search);
  allRates = [...flexData, ...seasonalData];

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


  const filteredRoutes = cal.filterRoutes(allRates, search);
  const arrangedRates = cal.arrangeRates(filteredRoutes, search);
  const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
  const addedFees = cal.addFees(filteredBlockouts.rates, feesData);
  const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
  const addedBonds = cal.addBonds(addedSpecials, bondsData);
  const addAddons = cal.addAddons(addedBonds, addonsData);
  const addTerms = cal.addTerms(addAddons, termsData);

  let options = {}
  const { data: dataOption } = await supabase.rpc("search_options").select();

  dataOption.forEach((opt) => {
    options[opt.name] = opt.options;
  });

  return {
    detail: JSON.parse(JSON.stringify(addTerms[0])),
    search: JSON.parse(JSON.stringify(search)),
    options: JSON.parse(JSON.stringify(options)),
  }
}
