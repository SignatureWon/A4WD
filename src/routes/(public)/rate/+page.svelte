<script>
    import { DatePicker, DatePickerInput } from "carbon-components-svelte";
  
    let search = {
      pickup: "",
      dropoff: "",
      date_start: dayjs(),
      date_end: dayjs().add(7, "day"),
      license: "",
      age: "",
      category: "",
    };
    let rows = [];
  </script>
  
  <DatePicker
    datePickerType="single"
    dateFormat="d/m/Y"
    bind:value={search.date_start}
  >
    <DatePickerInput labelText="Start date" placeholder="mm/dd/yyyy" />
  </DatePicker>
  <DatePicker
    datePickerType="single"
    dateFormat="d/m/Y"
    bind:value={search.date_end}
  >
    <DatePickerInput labelText="End date" placeholder="mm/dd/yyyy" />
  </DatePicker>
  