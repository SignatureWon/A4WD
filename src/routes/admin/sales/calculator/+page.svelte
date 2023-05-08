<script>
  import { supabase } from "$lib/supabaseClient";
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
  import dayjs from "dayjs";
  export let data;

  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs(),
    date_end: "",
    license: "",
    age: "",
    category: "",
  };

  let pageSize = 100;
  let page = 1;
  let headers = [
    { key: "vehicle_name", value: "Vehicles" },
    { key: "license_name", value: "License" },
    { key: "category_name", value: "category" },
    { key: "age_name", value: "age" },
    { key: "flex", value: "flex" },
    { key: "daily", value: "daily" },
    { key: "date_start", value: "date_start" },
    { key: "date_end", value: "date_end" },
  ];
  let rows = [];
  let filteredRowIds = [];

  const DbSearch = async () => {
    // console.log(search);
    let query = supabase.rpc('get_rates').select()
    //   .from("ratesList")
    //   .select(
    //     "id, rates(id, license(id, name)), vehicles(id, name, age, categories(id, name)), depots, daily, flex, date_start, date_end, tiers, ratesSeasons"
    //   );

    if (search.pickup !== "") {
      query = query.eq("depot_id", search.pickup);
    }
    if (search.date_start !== "") {
      query = query.gte("date_start", search.date_start);
      // query = query.gte("routes_date_start", search.date_start);
    }
    if (search.date_end !== "") {
      query = query.lte("date_end", search.date_end);
      // query = query.lte("routes_date_end", search.date_end);
    }
    if (search.license !== "") {
      query = query.eq("license_id", search.license);
    }
    if (search.age !== "") {
      query = query.eq("age_id", search.age);
    }
    if (search.category !== "") {
      query = query.eq("category_id", search.category);
    }

    //   console.log(search.category);
    //   query = query.contains("vehicles->>categories->>id", JSON.stringify([{ id: search.category }]) );
    //   query = query.eq("vehicles->categories", JSON.stringify([{ id: search.category }]));
    //   .eq(
    //     "vehicles->categories", JSON.stringify({id: search.category}))
        // JSON.stringify([{
        //   id: search.category,
        // }])
      //   query = query.contains("vehicles", JSON.stringify([{ category: user.id }]));
    //   query = query.contains("vehicles", [
    //     { categories: [{ id: search.category }] },
    //   ]);
    //   query = query.contains('vehicles.categories', JSON.stringify([{ id: search.category }]))
    //   query = query.eq("vehicles->categories->id", search.category);
    //   .eq("vehicles.categories.id", search.category);

    const { data: ratesListData, error: ratesListError } = await query;

    console.log(ratesListData);
    // supabase
    //   .from("ratesList")
    //   .select(
    //     "rates, vehicles, depots, daily, flex, date_start, date_end, tiers, ratesSeasons"
    //   )
    //   .gte("date_start", search.date_start)
    //   .lte("date_end", search.date_end);
    rows = ratesListData;
  };
</script>

<div class="bg-white px-5 py-3">
  <h2 class="font-bold text-brand-600 text-lg mb-4">Check Prices</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="grid grid-cols-2">
      <InputSelect
        name="pickup"
        label="Pick-up"
        bind:value={search.pickup}
        options={data.depots}
        half={true}
      />
      <InputSelect
        name="dropoff"
        label="Drop-off"
        bind:value={search.dropoff}
        options={data.depots}
        half={true}
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
      <Button
        class="w-full flex justify-center items-center"
        on:click={DbSearch}
      >
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
      {:else if ["date_start", "date_end", "travel_start", "travel_end", "created_at", "updated_at"].includes(cell.key)}
        {dayjs(cell.value).format("DD/MM/YYYY")}
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
