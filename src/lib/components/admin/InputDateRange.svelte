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
  export let required = false;
</script>

<div class={half ? "" : "md:col-span-2"}>
  <DatePicker
    datePickerType="range"
    dateFormat="d/m/Y"
    on:change={(e) => {
      // let oriTo = dayjs(valueTo)
      let from = dayjs(e.detail.selectedDates[0])
      let to = dayjs(e.detail.selectedDates[1])
      
      // console.log("from", from.format("DD/MM/YYYY"));
      // console.log("to", to.format("DD/MM/YYYY"));
      // console.log("oriTo", oriTo.format("DD/MM/YYYY"));

      // if (oriTo.isSame(from) && oriTo.isAfter(to)) {
      //   from = to;
      // }

      valueFrom = from;
      valueTo = to;

      // console.log(from, oriTo, from.isAfter(oriTo));
      
      // if (from.isAfter(to, "day")) {

      // }
      
      // valueFrom = dayjs(e.detail.selectedDates[0]).format("MM/DD/YYYY");
      // valueTo = dayjs(e.detail.selectedDates[1]).format("MM/DD/YYYY");
    }}
    valueFrom={dayjs(valueFrom).format("DD/MM/YYYY")}
    valueTo={dayjs(valueTo).format("DD/MM/YYYY")}
    >
    <DatePickerInput
      name={nameFrom}
      labelText={labelFrom}
      placeholder="dd/mm/yyyy"
      required={required}
    />
    <DatePickerInput
      name={nameTo}
      labelText={labelTo}
      placeholder="dd/mm/yyyy"
      required={required}
    />
  </DatePicker>
</div>
