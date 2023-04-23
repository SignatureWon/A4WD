<script>
  import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  import dayjs from "dayjs";
  import customParseFormat from "dayjs/plugin/customParseFormat";
  dayjs.extend(customParseFormat);

  export let nameFrom = "";
  export let nameTo = "";
  export let labelFrom = "";
  export let labelTo = "";
  export let valueFrom = "";
  export let valueTo = "";
  export let half = false;

  valueFrom = dayjs(valueFrom).format("DD/MM/YYYY")
  valueTo = dayjs(valueTo).format("DD/MM/YYYY")
</script>

<div class={half ? "" : "md:col-span-2"}>
  <DatePicker
    datePickerType="range"
    dateFormat="d/m/Y"
    bind:valueFrom={valueFrom}
    bind:valueTo={valueTo}
  >
    <DatePickerInput name={nameFrom} labelText={labelFrom} placeholder="dd/mm/yyyy" />
    <DatePickerInput name={nameTo} labelText={labelTo} placeholder="dd/mm/yyyy" />
  </DatePicker>
</div>
