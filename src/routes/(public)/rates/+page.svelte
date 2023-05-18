<script>
  import { supabase } from "$lib/supabaseClient";
  import {
    Button,
    DatePicker,
    DatePickerInput,
  } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import isBetween from "dayjs/plugin/isBetween";
  dayjs.extend(isBetween);
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import { onMount } from "svelte";

  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs().format("DD/MM/YYYY"),
    date_end: dayjs().add(7, "day").format("DD/MM/YYYY"),
    license: "",
    age: "",
    category: "",
  };
  let rows = [];
  let options = {
    depots: [],
    vehicles: [],
    ages: [],
    licenses: [],
  };

  const loadRate = async () => {
    const date_start = dayjs(search.date_start, "DD/MM/YYYY");
    const date_end = dayjs(search.date_end, "DD/MM/YYYY");
    // const { data: getFlexRates } = await supabase.rpc("get_rates")
    //   .gte("date_start", date_start.subtract(7, "day"))
    //   .lte("date_end", date_end.add(7, "day"))
    //   .eq("depot_id", search.pickup)
    //   .eq("rates_type", "flex")
    //   .order("rates_id", {ascending: true})
    //   .order("vehicle_id", {ascending: true})
    //   .order("date_start", {ascending: true})

    const { data: getSeasonRates } = await supabase
      .rpc("get_rates")
      // .or(
      //   `date_start.lte.${date_start.format(
      //     "YYYY-MM-DD"
      //   )},date_end.gte.${date_end.format("YYYY-MM-DD")}`
      // ) 
      // .gte("date_start", date_start.subtract(7, "day"))
      // .lte("date_end", date_end.add(7, "day"))
      .eq("depot_id", search.pickup)
      .eq("rates_type", "seasonal")
      .order("rates_id", { ascending: true })
      .order("vehicle_id", { ascending: true })
      .order("date_start", { ascending: true });

    console.log(getSeasonRates);

    rows = [...getSeasonRates];
  };

  onMount(async () => {
    const { data, error } = await supabase.rpc("search_options").select();
    // console.log(data);

    data.forEach((opt) => {
      options[opt.name] = opt.options;
    });
  });
</script>

<div class="max-w-lg mx-auto p-5">
  <div class="grid grid-cols-2 gap-4">
    <InputSelect
      name="pickup"
      label="Pick-up"
      bind:value={search.pickup}
      options={options["depots"]}
      half={true}
      required={true}
    />
    <InputSelect
      name="dropoff"
      label="Drop-off"
      bind:value={search.dropoff}
      options={options["depots"]}
      half={true}
      required={true}
    />
    <DatePicker
      datePickerType="single"
      dateFormat="d/m/Y"
      bind:value={search.date_start}
      class="w-full"
    >
      <DatePickerInput labelText="Start date" placeholder="DD/MM/YYYY" />
    </DatePicker>
    <DatePicker
      datePickerType="single"
      dateFormat="d/m/Y"
      bind:value={search.date_end}
      class="w-full"
    >
      <DatePickerInput labelText="End date" placeholder="DD/MM/YYYY" />
    </DatePicker>
    <Button on:click={loadRate} class="col-span-2">Search</Button>
  </div>
</div>

<div class="p-5">
  {#each rows as r, i}
    <div class="p-4">
      {i + 1}. {dayjs(r.date_start).format("DD/MM/YYYY")}-{dayjs(
        r.date_end
      ).format("DD/MM/YYYY")} | {r.vehicle_name}
    </div>
  {/each}
</div>
