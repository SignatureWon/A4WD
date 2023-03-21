<script>

  import { Button, DatePicker, DatePickerInput, Select, SelectItem } from "carbon-components-svelte";

</script>
<div class="bg-white px-5 py-3">
    <h2 class="font-bold text-brand-600 text-lg mb-4">Check Prices</h2>
    <div class="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
      <div class="flex">
        <Select
          labelText="Pick up"
          on:change={(e) => console.log("value", e.target.value)}
        >
          <SelectItem value="Adelaide" text="Adelaide" />
          <SelectItem value="Alice-Springs" text="Alice Springs" />
          <SelectItem value="Brisbane" text="Brisbane" />
          <SelectItem value="Broome" text="Broome" />
          <SelectItem value="Cairns" text="Cairns" />
          <SelectItem value="Darwin" text="Darwin" />
          <SelectItem value="Hobart" text="Hobart" />
          <SelectItem value="Melbourne" text="Melbourne" />
          <SelectItem value="Perth" text="Perth" />
          <SelectItem value="Sydney" text="Sydney" />
        </Select>
        <Select
          labelText="Drop off"
          class="-ml-1"
          on:change={(e) => console.log("value", e.target.value)}
        >
          <SelectItem value="Adelaide" text="Adelaide" />
          <SelectItem value="Alice-Springs" text="Alice Springs" />
          <SelectItem value="Brisbane" text="Brisbane" />
          <SelectItem value="Broome" text="Broome" />
          <SelectItem value="Cairns" text="Cairns" />
          <SelectItem value="Darwin" text="Darwin" />
          <SelectItem value="Hobart" text="Hobart" />
          <SelectItem value="Melbourne" text="Melbourne" />
          <SelectItem value="Perth" text="Perth" />
          <SelectItem value="Sydney" text="Sydney" />
        </Select>
      </div>
      <div class="flex">
        <DatePicker datePickerType="range" on:change>
          <DatePickerInput
            labelText="Start date"
            placeholder="mm/dd/yyyy"
          />
          <DatePickerInput
            class="-ml-1"
            labelText="End date"
            placeholder="mm/dd/yyyy"
          />
        </DatePicker>
      </div>
      <div class="flex">
        <Select
          labelText="Driver license"
          on:change={(e) => console.log("value", e.target.value)}
        >
          <SelectItem value="AU/NZ" text="AU/NZ" />
          <SelectItem value="Other" text="Other" />
        </Select>
        <Select
          labelText="Driver age"
          class="-ml-1"
          on:change={(e) => console.log("value", e.target.value)}
        >
          <SelectItem value="18-20" text="18-20" />
          <SelectItem value="21+" text="21+" />
        </Select>
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
