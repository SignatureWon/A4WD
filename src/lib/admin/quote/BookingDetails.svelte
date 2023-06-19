<script>
  import dayjs from "dayjs";

  export let quote;
  console.log(quote);
</script>

<div class="p-3 bg-gray-100 flex items-center">
  <div class="w-32">Booking Date</div>
  <div class="flex-1 value">
    {dayjs(quote.details.date_book).format("DD/MM/YYYY (ddd)")}
  </div>
</div>
