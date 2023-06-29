<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabaseClient";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(isBetween);
  import { calculator } from "$lib/calculator";
  import { page } from "$app/stores";
  import Search from "../Search.svelte";

  export let data;

  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs().format("YYYY-MM-DD"),
    date_end: dayjs().add(7, "day").format("YYYY-MM-DD"),
    license: "",
    age: "",
    category: "",
    pax: 2,
  };
  // console.log("DD", search.date_start);

  let options = {};

  onMount(async () => {
    const { data: data_options, data_error } = await supabase.rpc("search_options").select();
    options = data_options;

    $page.url.searchParams.forEach((value, key) => {
      // if (["date_start", "date_end"].includes(key)) {
      //   console.log(key, value);
      //   // value = dayjs(value);
      //   value = dayjs(value).format("YYYY-MM-DD");
      // }
      search[key] = value;
    });

    // console.log("searchsearch", search);

    const results = await calculator(search);

    // console.log("results", results);
  });
</script>

<Search options={data.options} {search} />
