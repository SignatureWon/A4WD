<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  import { prevent_default } from "svelte/internal";
  dayjs.extend(customParseFormat);

  export let nameFrom = "";
  export let nameTo = "";
  export let labelFrom = "";
  export let labelTo = "";
  export let valueFrom = "";
  export let valueTo = "";
  export let required = false;
</script>

<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-0">
  <DatePicker
    datePickerType="single"
    dateFormat="d/m/Y"
    bind:value={valueFrom}
    on:change={(e) => {
      if (
        dayjs(e.detail.dateStr, "DD/MM/YYYY").isAfter(
          dayjs(valueTo, "DD/MM/YYYY")
        )
      ) {
        valueTo = e.detail.dateStr;
      }
    }}
  >
    <DatePickerInput
      name={nameFrom}
      labelText={labelFrom}
      placeholder="DD/MM/YYYY"
      autocomplete="off"
      {required}
      readonly
    />
  </DatePicker>
  <DatePicker datePickerType="single" dateFormat="d/m/Y" bind:value={valueTo} flatpickrProps={{
    position: "auto right"
  }}>
    <DatePickerInput
      name={nameTo}
      labelText={labelTo}
      placeholder="DD/MM/YYYY"
      autocomplete="off"
      {required}
      readonly
    />
  </DatePicker>
</div>
