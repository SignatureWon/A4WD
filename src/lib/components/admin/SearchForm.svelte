<script>
  import { Button } from "carbon-components-svelte";
  import InputSelect from "$lib/components/admin/InputSelect.svelte";
  import InputDateRange from "$lib/components/admin/InputDateRange.svelte";
  import dayjs from "dayjs";
  export let search = {
    pickup: "",
    dropoff: "",
    date_start: dayjs(),
    date_end: dayjs().add(7, "day"),
    license: "",
    age: "",
    category: "",
  };
  export let data = {};
  export let action;
</script>

<div class="bg-white px-5 py-3 mb-4">
  <h2 class="font-bold text-brand-600 text-lg mb-4">Check Prices</h2>
  <!-- <form action=""></form> -->
  <form on:submit|preventDefault={action}>
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
