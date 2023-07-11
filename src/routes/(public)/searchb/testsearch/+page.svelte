<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(isBetween);
  import { cal } from "$lib/cal";
  //   import { cal } from "$lib/cal";
  import { page } from "$app/stores";

  onMount(async () => {
    let search = {
      pickup: "",
      dropoff: "",
      date_start: dayjs().format("DD/MM/YYYY"),
      date_end: dayjs().add(7, "day").format("DD/MM/YYYY"),
      license: "",
      age: "",
      category: "",
      pax: 2,
    };
    $page.url.searchParams.forEach((value, key) => {
      if (["date_start", "date_end"].includes(key)) {
        // value = dayjs(value);
        value = dayjs(value, "DD/MM/YYYY");
      }
      search[key] = value;
    });

    // const results = calculator(search);
    let results = [];
    let blocked = [];
    let allRates = [];
    let specials = [];

    if (search.pickup !== "" && search.dropoff !== "") {
      const { data: flexData } = await cal.getFlex(supabase, search);
      // allRates = [...flexData]
      const { data: seasonalData } = await cal.getSeasonal(supabase, search);
      allRates = [...flexData, ...seasonalData];
      // console.log("flexData", flexData);

      // console.log("flex:", flexData.length, "seasonal:", seasonalData.length);

      // const { data: ratesData, error: ratesError } = await cal.getRates(
      //   supabase,
      //   search
      // );
      // console.log(ratesData);
      const { data: feesData, error: feesError } = await cal.getFees(supabase, search);
      const { data: blockoutsData, error: blockoutsError } = await cal.getBlockouts(supabase, search);

      const { data: specialsData, error: specialsError } = await cal.getSpecials(supabase, search);
      const { data: bondsData, error: bondsError } = await cal.getBonds(supabase, search);
      // console.log(bondsData);

      const filteredRoutes = cal.filterRoutes(allRates, search);

      const arrangedRates = cal.arrangeRates(filteredRoutes, search);
      const filteredBlockouts = cal.filterBlockouts(arrangedRates, blockoutsData);
      const addedFees = cal.addFees(filteredBlockouts.rates, feesData);
      const addedSpecials = cal.addSpecials(addedFees, specialsData, search);
      const addedBonds = cal.addBonds(addedSpecials, bondsData, search);
      //   console.log(addedBonds);

      results = [...addedBonds];
      blocked = [...filteredBlockouts.blocked];
      specials = [...addedSpecials];
    }
  });
</script>
