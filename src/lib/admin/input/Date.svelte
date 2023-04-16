<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);

  export let key = "";
  export let field = {};
  export let data = {};
</script>

<DatePicker
  datePickerType="single"
  dateFormat="d/m/Y"
  on:change={(e) => {
    data[key] = dayjs(e.detail.selectedDates[0]);
  }}
  value={dayjs(data[key]).format("DD/MM/YYYY")}
>
  <DatePickerInput
    labelText={field.label}
    name={key}
    placeholder="dd/mm/yyyy"
  />
</DatePicker>
