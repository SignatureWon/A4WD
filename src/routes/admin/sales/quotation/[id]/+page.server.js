import { db } from "$lib/server/db";
import { supabase } from "$lib/supabaseClient";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { cal } from "$lib/cal";

export async function load({ url, params }) {
  const keys = [
    "id",
    "created_at",
    "updated_at",
    "details",
    "users",
    "status",
    "deposit",
    "payment_1",
    "payment_2",
    "balance",
    "nett",
    "gross",
    "profit",
    "discount",
    "agent",
    "agent_fee",
    "system_fee",
    "nett_profit",
    "refund",
    "remark",
    "remark_deposit",
    "remark_payment_1",
    "remark_payment_2",
    "remark_balance",
    "remark_refund",
    "paid_deposit",
    "paid_payment_1",
    "paid_payment_2",
    "paid_balance",
    "add_discount",
    "add_discount_remark",
  ];

  const quote = await db.one({
    table: "quotes",
    id: params.id,
    keys: keys,
  });

  let license_id = null;
  if ("license" in quote.details) {
    license_id = quote.details.license.id;
  } else {
    const { data: dataLicense } = await supabase
      .from("constants")
      .select("id")
      .eq("type", "licenses")
      .eq("name", quote.details.driver.license)
      .single();
    license_id = dataLicense.id;
  }
  let rates_id = null;
  if ("rates" in quote.details) {
    rates_id = quote.details.rates.id
  }

  const search = {
    pickup: quote.details.pickup.id,
    dropoff: quote.details.dropoff.id,
    date_start: dayjs(quote.details.date_start),
    date_end: dayjs(quote.details.date_end),
    license: license_id,
    rates: rates_id,
    vehicle: quote.details.vehicle.id,
  };
  let allRates = [];
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

  // console.log(addTerms.length);

  //   const { data: vehicle } = await supabase
  //     .from("vehicles")
  //     .select("name, slug, image")
  //     .eq("id", quote.id)
  //     .single();
  const { data: user } = await supabase.from("users").select().eq("id", quote.users).single();
  let options = {}
  const { data: dataOption } = await supabase.rpc("search_options").select();

  dataOption.forEach((opt) => {
    options[opt.name] = opt.options;
  });


  return {
    quote: quote,
    user: user,
    detail: JSON.parse(JSON.stringify(addTerms[0])),
    options: JSON.parse(JSON.stringify(options)),
    path: url.pathname,
    id: params.id,
  };
}
