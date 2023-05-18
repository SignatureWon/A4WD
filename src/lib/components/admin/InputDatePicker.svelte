<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);

  export let name;
  export let label = "";
  export let value = "";
  export let half = false;
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <DatePicker datePickerType="single" dateFormat="d/m/Y" bind:value>
    <DatePickerInput
      {name}
      labelText={label}
      placeholder="DD/MM/YYYY"
      {required}
    />
  </DatePicker>
</div>
