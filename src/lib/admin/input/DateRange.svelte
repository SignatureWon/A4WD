<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);

  export let key = "";
  export let field = {};
  export let data = {};

  const key2 = {
    date_start: "date_end"
  }
  const label2 = {
    date_start: "End Date"
  }
</script>

<DatePicker
  datePickerType="range"
  dateFormat="d/m/Y"
  on:change={(e) => {
    data[key] = dayjs(e.detail.selectedDates[0]);
    data[key2[key]] = dayjs(e.detail.selectedDates[1]);
  }}
  valueFrom={dayjs(data[key]).format("DD/MM/YYYY")}
  valueTo={dayjs(data[key2[key]]).format("DD/MM/YYYY")}
>
  <DatePickerInput
    labelText={field.label}
    name={key}
    placeholder="dd/mm/yyyy"
  />
  <DatePickerInput
    labelText={label2[key]}
    name={key2[key]}
    placeholder="dd/mm/yyyy"
  />
</DatePicker>
