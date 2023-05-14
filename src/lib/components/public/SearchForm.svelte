<script>
  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import {
    Button,
    DatePicker,
    DatePickerInput,
    Select,
    SelectItem,
  } from "carbon-components-svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import dayjs from "dayjs";
  let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs(),
    date_end: dayjs().add(7, "day"),
    license: "",
    age: "",
    category: "",
  };
  let options = {
    depots: [],
    vehicles: [],
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

    console.log(options);
  });
</script>

<div class="bg-white px-5 py-3">
  <h2 class="font-bold text-brand-600 text-lg mb-4">Check Prices</h2>
  <div class="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
    <div class="flex">
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
    <div class="flex">
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
    <div class="flex">
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
    <div class="md:mt-6 lg:mt-0">
      <Button class="w-full flex justify-center items-center">
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
