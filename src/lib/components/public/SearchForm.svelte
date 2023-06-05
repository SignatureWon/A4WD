<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputNumber from "$lib/components/admin/InputNumber.svelte";
  import InputDateRange2 from "$lib/components/admin/InputDateRange2.svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);
  // export let narrow = false
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

  // console.log(search);
  // $: {
  //   $page.url.searchParams.forEach((value, key) => {
  //     if (["date_start", "date_end"].includes(key)) {
  //       value = dayjs(value, "DD/MM/YYYY");
  //     }
  //     search[key] = value;
  //   });

  //   // console.log(search);
  // }

  // let search = {
  //   pickup: "",
  //   dropoff: "",
  //   date_start: dayjs(),
  //   date_end: dayjs().add(7, "day"),
  //   license: "",
  //   age: "",
  //   category: "",
  // };
  let options = {
    depots: [],
    categories: [],
    ages: [],
    licenses: [],
  };
  // let  = [
  //   {options: [{id:"", name:""}]},
  //   {options: [{id:"", name:""}]},
  //   {options: [{id:"", name:""}]},
  //   {options: [{id:"", name:""}]},
  // ];
  onMount(async () => {
    const { data, error } = await supabase.rpc("search_options").select();

    data.forEach((opt) => {
      options[opt.name] = opt.options;
    });

    // console.log(options);

    $page.url.searchParams.forEach((value, key) => {
      // if (["date_start", "date_end"].includes(key)) {
      //   console.log(key, value);
      //   // if (dayjs(value).$D) {
      //   //   value = dayjs(value);
      //   // } else {
      //   value = dayjs(value, "DD/MM/YYYY");
      //   // }
      // }
      search[key] = value;
    });

    // console.log("search", search);
  });

  // $: {
  //   $page.url.searchParams.forEach((value, key) => {
  //     search[key] = value;
  //   });
  //   // console.log("search", search);
  // }
</script>

<form action="/search/redirect" method="get">
  <div class="bg-white px-5 py-3">
    <h2 class="font-bold text-brand-600 text-lg mb-4">Check Prices</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
      <div class="grid grid-cols-2">
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
      </div>
      <div>
        <InputDateRange2
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
          options={options["licenses"]}
          half={true}
        />
        <InputSelect
          name="age"
          label="Age"
          bind:value={search.age}
          options={options["ages"]}
          half={true}
        />
      </div>
      <div class="grid grid-cols-3">
        <div class="grid grid-cols-2 col-span-2">
          <InputSelect
            name="category"
            label="Category"
            bind:value={search.category}
            options={options["categories"]}
          />
        </div>
        <div class="grid grid-cols-2">
          <InputNumber
          name="pax"
          label="Passengers"
          bind:value={search.pax}
        />
        </div>
      </div>
      <!-- <div class="md:mt-6 lg:mt-0"> -->
      <div class="md:col-span-2 lg:col-span-1">
        <Button type="submit" class="w-full flex justify-center items-center">
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
</form>
