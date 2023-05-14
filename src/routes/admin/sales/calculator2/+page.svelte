<script>
  import { supabase } from "$lib/supabaseClient";
  import { v4 as uuidv4 } from "uuid";
  import { cal } from "$lib/cal";
  import SearchForm from "$lib/components/admin/SearchForm.svelte";
  import SearchResults from "$lib/components/admin/SearchResults.svelte";
  import dayjs from "dayjs";
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(isBetween);

  export let data;

  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs(),
    date_end: dayjs().add(7, "day"),
    license: "",
    age: "",
    category: "",
  };
  let rows = [];

  const action = async () => {
    search.date_start = dayjs(search.date_start);
    search.date_end = dayjs(search.date_end);
    const duration = search.date_end.diff(search.date_start, "day");

    const { data: ratesData, error: ratesError } = await cal.getRates(
      supabase,
      search
    );
    const { data: feesData, error: feesError } = await cal.getFees(
      supabase,
      search
    );
    const { data: blockoutsData, error: blockoutsError } =
      await cal.getBlockouts(supabase, search);

    console.log(blockoutsData);
    const { data: specialsData, error: specialsError } = await cal.getSpecials(
      supabase,
      search
    );

    let results = [];
    ratesData.forEach((rate) => {
      const valid = rate.routes.filter((arrRoutes) => {
        return (
          arrRoutes.from.id === search.pickup &&
          arrRoutes.to.id === search.dropoff
        );
      });
      if (valid.length) {
        if (valid[0].active) {
          rate.routes = valid[0];
          rate.min_days = valid[0].days || 0;
          rate.one_way = valid[0].fee || 0;

          if (rate.rates_type === "seasonal") {
            rate.daily = cal.getSeasonalDaily(
              duration,
              rate.tiers,
              rate.min_days
            );
            console.log(rate);
          }
          results.push(rate);
        }
      }
    });

    console.log("ratesData", ratesData);
    console.log("results", results);
  };
</script>

<SearchForm {data} {search} {action} />
<SearchResults {rows} />
