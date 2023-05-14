<script>
  import { supabase } from "$lib/supabaseClient";
  import { v4 as uuidv4 } from "uuid";
  import {
    Button,
    DataTable,
    Pagination,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import { page as storePage } from "$app/stores";
  import { goto } from "$app/navigation";
  import { cal } from "$lib/cal";
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

  let pageSize = 100;
  let page = 1;
  // let headers = [
  //   { key: "vehicle_name", value: "Vehicles" },
  //   { key: "license_name", value: "License" },
  //   { key: "category_name", value: "category" },
  //   { key: "age_name", value: "age" },
  //   { key: "flex", value: "flex" },
  //   { key: "daily", value: "daily" },
  //   { key: "date_start", value: "date_start" },
  //   { key: "date_end", value: "date_end" },
  // ];
  let headers = [
    // { key: "rates_id", value: "ID" },
    // { key: "rates_type", value: "Type" },
    { key: "vehicle_name", value: "Vehicle" },
    // { key: "depot_name", value: "Depot" },
    // { key: "date_start", value: "Start Date" },
    // { key: "date_end", value: "End Date" },
    // { key: "routes_date_start", value: "Route Start Date" },
    // { key: "routes_date_end", value: "Route End Date" },
    // { key: "vehicles_categories", value: "Categories" },
    // { key: "license_name", value: "License" },
    { key: "rates_type", value: "Type" },
    { key: "license", value: "License" },
    { key: "gross", value: "gross" },
    { key: "nett", value: "nett" },
    { key: "profit", value: "profit" },
    // { key: "age_name", value: "age" },
    // { key: "depot_name", value: "Depot" },

    // { key: "vehicles.age.name", value: "Age" },
    // { key: "rates.license.name", value: "License" },
    // { key: "vehicles.name", value: "vehicle" },
    // { key: "vehicles.categories", value: "category" },
    // { key: "flex", value: "flex" },
    // { key: "daily", value: "daily" },
    // { key: "date_start", value: "date_start" },
    // { key: "date_end", value: "date_end" },
  ];
  let rows = [];
  let filteredRowIds = [];

  const DbSearch = async () => {
    search.date_start = dayjs(search.date_start);
    search.date_end = dayjs(search.date_end);

    // console.log(search);
    let query = supabase.rpc("get_rates").select();

    query = query.or(
      `date_start.lte.${search.date_start.format(
        "YYYY-MM-DD"
      )},date_end.gte.${search.date_end.format("YYYY-MM-DD")}`
    );
    query = query.lte("date_start", search.date_end);
    query = query.gte("date_end", search.date_start);

    if (search.category !== "") {
      query = query.contains(
        "vehicles_categories",
        JSON.stringify([{ id: search.category }])
      );
    }
    if (search.license !== "") {
      query = query.or(`license_id.eq.${search.license},license_id.is.null`);
    }
    if (search.age !== "") {
      query = query.eq("age_id", search.age);
    }
    if (search.pickup !== "") {
      query = query.eq("depot_id", search.pickup);
      // query = query.eq("routes.from.id", search.pickup);
    }

    const { data: ratesListData, error: ratesListError } = await query;

    // console.log("ratesListData", ratesListData);

    /**
     * 1. rearrange to group by vehicles > rates
     */
    let vehiclesRates = {};
    ratesListData.forEach((r) => {
      // set default
      if (!(r.vehicle_id in vehiclesRates)) {
        vehiclesRates[r.vehicle_id] = {};
      }
      if (!(r.rates_id in vehiclesRates[r.vehicle_id])) {
        vehiclesRates[r.vehicle_id][r.rates_id] = [];
      }
      vehiclesRates[r.vehicle_id][r.rates_id].push(r);
    });

    console.log("search", search);

    console.log(vehiclesRates);

    let validRates = [];

    const travel_duration = search.date_end.diff(search.date_start, "day");

    for (const keyVehicle in vehiclesRates) {
      const thisVehicle = vehiclesRates[keyVehicle];
      for (const keyRate in thisVehicle) {
        const thisRate = thisVehicle[keyRate];
        // console.log("thisRate", thisRate);
        // check available routes
        const availRoutes = thisRate[0].routes.filter((arrRoutes) => {
          return (
            arrRoutes.from.id === search.pickup &&
            arrRoutes.to.id === search.dropoff
          );
        });
        // console.log("availRoutes", availRoutes);
        // if route available
        if (availRoutes.length > 0) {
          let nett = 0;
          let gross = 0;
          let profit = 0;

          let dailyRates = [];

          // get seasonal price
          if (thisRate[0].rates_type === "seasonal") {
            let counter = 0;
            thisRate.forEach((season) => {
              console.log(counter);
              counter++;
              if (counter < travel_duration) {
                const daily = cal.getSeasonalDaily(
                  travel_duration,
                  season.tiers
                );
                for (
                  var d = new Date(
                    search.date_start.$y,
                    search.date_start.$M,
                    search.date_start.$D
                  );
                  d <=
                  new Date(
                    search.date_end.$y,
                    search.date_end.$M,
                    search.date_end.$D
                  );
                  d.setDate(d.getDate() + 1)
                ) {
                  const day = dayjs(d);
                  if (
                    day.isBetween(
                      dayjs(season.date_start),
                      dayjs(season.date_end),
                      "day",
                      "[)"
                    )
                  ) {
                    let sameDay = false;
                    dailyRates.forEach((dr) => {
                      if (day.isSame(dr.day)) {
                        sameDay = true;
                        // counter--;
                      }
                    });

                    if (!sameDay) {
                      let todayNett = daily * season.rates_nett;
                      let todayGross = daily * season.rates_gross;
                      let todayProfit = todayGross - todayNett;
                      nett += todayNett;
                      gross += todayGross;
                      profit += todayProfit;

                      dailyRates.push({
                        day: day,
                        nett: todayNett,
                        gross: todayGross,
                        profit: todayProfit,
                      });
                    }
                  }
                }
              }

              // console.log({
              //   season: season,
              //   travel_duration: travel_duration,
              //   daily: daily,
              //   nett: nett,
              //   gross: gross,
              //   profit: profit,
              // });
            });
            // thisRate[0].routes = availRoutes
            // console.log("seasonal");
          } else {
            let counter = 0;

            // console.log("thisRate", thisRate);
            thisRate.forEach((season) => {
              console.log(counter);
              if (counter < travel_duration) {
                // console.log("flex", season);
                const daily = season.daily;
                for (
                  var d = new Date(
                    search.date_start.$y,
                    search.date_start.$M,
                    search.date_start.$D
                  );
                  d <
                  new Date(
                    search.date_end.$y,
                    search.date_end.$M,
                    search.date_end.$D
                  );
                  d.setDate(d.getDate() + 1)
                ) {
                  const day = dayjs(d);
                  if (
                    day.isBetween(
                      dayjs(season.date_start),
                      dayjs(season.date_end),
                      "day",
                      "[)"
                    )
                  ) {
                    let sameDay = false;
                    dailyRates.forEach((dr) => {
                      if (day.isSame(dr.day)) {
                        sameDay = true;
                        counter--;
                      }
                    });

                    if (!sameDay) {
                      let todayNett = daily * season.rates_nett;
                      let todayGross = daily * season.rates_gross;
                      let todayProfit = todayGross - todayNett;
                      nett += todayNett;
                      gross += todayGross;
                      profit += todayProfit;

                      dailyRates.push({
                        day: day,
                        nett: todayNett,
                        gross: todayGross,
                        profit: todayProfit,
                      });
                    }
                  }
                }

                // console.log({
                //   season: season,
                //   travel_duration: travel_duration,
                //   daily: daily,
                //   nett: nett,
                //   gross: gross,
                //   profit: profit,
                // });
              }
              counter++;
            });
          }

          console.log("dailyRates", dailyRates);
          validRates.push({
            id: uuidv4(),
            vehicle_name: thisRate[0].vehicle_name,
            rates_type: thisRate[0].rates_type,
            nett: nett,
            gross: gross,
            profit: profit,
            license: thisRate[0].license_name || "Any",
          });
        }
      }
    }

    console.log("validRates", validRates);

    // thisRate[0].routes.forEach(route => {
    //   console.log({
    //     from: route.from.id,
    //     to: route.to.id,
    //     pickup: search.pickup
    //   });
    // })

    // console.log('availRoutes', availRoutes);
    // thisRate.forEach((objRate) => {
    //   if (r.rates_type === "seasonal") {
    //     let daily = cal.getSeasonalDaily(travel_duration, r.tiers);
    //     nett = travel_duration * daily * r.nett;
    //     gross = travel_duration * daily * r.gross;
    //     profit = gross - nett;
    //   }
    //   //   }
    //   //   rates[r.vehicle_id][r.rates_id].push(r);
    //   // });
    // });
    // }
    // }
    // }

    //   // check available routes
    //   const routes = obj.filter((o) => {
    //     return o.from.id === search.pickup && o.to.id === search.dropoff;
    //   });

    //   // if route available
    //   if (routes.length > 0) {
    //     // if (!(r.rates_id in rates[r.vehicle_id])) {
    //     // }

    //     // check prices
    //     let nett = 0;
    //     let gross = 0;
    //     let profit = 0;

    //     if (r.rates_type === "seasonal") {
    //       const travel_duration = search.date_end.diff(
    //         search.date_start,
    //         "day"
    //       );
    //       let daily = cal.getSeasonalDaily(travel_duration, r.tiers);

    //       nett = travel_duration * daily * r.nett;
    //       gross = travel_duration * daily * r.gross;
    //       profit = gross - nett;
    //     }
    //   }

    //   rates[r.vehicle_id][r.rates_id].push(r);
    // });

    // console.log(ratesListData);
    // let rates = {};
    // ratesListData.forEach((r) => {
    //   if (r.rates_id in rates) {
    //     rates[r.rates_id].push(r);
    //   } else {
    //     rates[r.rates_id] = [r];
    //   }
    // });

    // let vehicleRates = {};
    // for (const id in rates) {
    //   rates[id].forEach((v) => {
    //     if (vehicle_id in vehicleRates) {
    //       vehicleRates[vehicle_id].push(v);
    //     } else {
    //       rates[r.rates_id] = [r];
    //     }
    //   });
    // }

    // console.log("rates", rates);
    // supabase
    //   .from("ratesList")
    //   .select(
    //     "rates, vehicles, depots, daily, flex, date_start, date_end, tiers, ratesSeasons"
    //   )
    //   .gte("date_start", search.date_start)
    //   .lte("date_end", search.date_end);
    // rows = ratesListData;
    rows = validRates;
  };
</script>

<div class="bg-white px-5 py-3">
  <h2 class="font-bold text-brand-600 text-lg mb-4">Check Prices</h2>
  <!-- <form action=""></form> -->
  <form on:submit|preventDefault={DbSearch}>
    <!-- <input type="text" required> -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="grid grid-cols-2">
        <!-- required={true} -->
        <InputSelect
          name="pickup"
          label="Pick-up"
          bind:value={search.pickup}
          options={data.depots}
          half={true}
          required={true}
          no_blank={true}
        />
        <InputSelect
          name="dropoff"
          label="Drop-off"
          bind:value={search.dropoff}
          options={data.depots}
          half={true}
          required={true}
          no_blank={true}
        />
      </div>
      <div>
        <InputDateRange
          nameFrom="date_start"
          nameTo="date_end"
          labelFrom="Start Date"
          labelTo="End Date"
          bind:valueFrom={search.date_start}
          bind:valueTo={search.date_end}
          required={true}
        />
      </div>
      <div class="grid grid-cols-2">
        <InputSelect
          name="license"
          label="License"
          bind:value={search.license}
          options={data.licenses}
          half={true}
        />
        <InputSelect
          name="age"
          label="Age"
          bind:value={search.age}
          options={data.ages}
          half={true}
        />
      </div>
      <div>
        <InputSelect
          name="category"
          label="Category"
          bind:value={search.category}
          options={data.categories}
        />
      </div>
      <div class="md:mt-6">
        <Button class="w-full flex justify-center items-center" type="submit">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="w-4 h-4"
            fill="currentColor"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"
            />
          </svg>
          <span class="ml-2">Search</span>
        </Button>
      </div>
    </div>
  </form>
</div>

<div class="bg-white px-5 py-3">
  <DataTable
    sortable
    {headers}
    {pageSize}
    {page}
    {rows}
    on:click:row={(row) => {
      goto(`${$storePage.url.pathname}/${row.detail.id}`);
    }}
    class="cursor-pointer"
  >
    <Toolbar class="mb-4">
      <ToolbarContent>
        <ToolbarSearch
          size="lg"
          persistent
          value=""
          shouldFilterRows
          bind:filteredRowIds
        />
      </ToolbarContent>
    </Toolbar>
    <svelte:fragment slot="cell" let:row let:cell>
      {#if cell.key === "status"}
        {#if cell.value === true}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="w-5 h-5 text-green-600"
            fill="currentColor"
            ><path fill="none" d="M0 0h24v24H0z" /><path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"
            /></svg
          >
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="w-5 h-5 text-gray-300"
            fill="currentColor"
            ><path fill="none" d="M0 0h24v24H0z" /><path
              d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829-1.414 1.414L11.003 16z"
            /></svg
          >
        {/if}
      {:else if ["date_start", "date_end", "routes_date_start", "routes_date_end", "travel_start", "travel_end", "created_at", "updated_at"].includes(cell.key)}
        {dayjs(cell.value).format("DD/MM/YYYY")}
      {:else if ["nett", "gross", "profit"].includes(cell.key)}
        {cell.value.toFixed(0)}
      {:else if cell.key === "vehicles_categories"}
        {#each cell.value as item}
          {item.name}<br />
        {/each}
      {:else if cell.value === null}
        &mdash;
      {:else}
        {cell.value}
      {/if}
    </svelte:fragment>
  </DataTable>
  <Pagination
    bind:pageSize
    bind:page
    totalItems={rows.length}
    pageSizeInputDisabled
  />
</div>
