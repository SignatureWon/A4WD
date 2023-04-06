<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);

  export let field = {};
  export let record = {};

  // if (!record[field.name]) {
  //   record[field.name] = dayjs();
  // }
  // if (!record[field.name2]) {
  //   record[field.name2] = dayjs();
  // }
</script>

<DatePicker
  datePickerType="range"
  dateFormat="d/m/Y"
  on:change={(e) => {
    record[field.name] = dayjs(e.detail.selectedDates[0]);
    record[field.name2] = dayjs(e.detail.selectedDates[1]);
  }}
  valueFrom={dayjs(record[field.name]).format("DD/MM/YYYY")}
  valueTo={dayjs(record[field.name2]).format("DD/MM/YYYY")}
>
  <DatePickerInput
    labelText={field.label}
    name={field.name}
    placeholder="dd/mm/yyyy"
  />
  <DatePickerInput
    labelText={field.label2}
    name={field.name2}
    placeholder="dd/mm/yyyy"
  />
</DatePicker>
