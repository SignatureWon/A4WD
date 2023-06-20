<script>
  import dayjs from "dayjs";
  export let quote;
  const iconRight = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-4 h-4" fill="currentColor" ><path fill="none" d="M0 0h24v24H0z" /><path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" /></svg>`;
</script>

<div class="bg-white rounded mb-4">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="h2">Trip Information</h2>
  </div>
  <div class="p-4">
    <div class="flex">
      <div class="w-1/4 max-w-xs pr-4">
        <img src={quote.details.vehicle.image} alt={quote.details.vehicle.name} class="rounded" />
      </div>
      <div class="flex-1">
        <div class="mb-4">
          <div class="label">Vehicle</div>
          <div class="value">{quote.details.vehicle.name}</div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="label">Pick-up</div>
            <div class="value">{quote.details.pickup.name}</div>
            <div>{dayjs(quote.details.date_start).format("DD/MM/YYYY (ddd)")}</div>
          </div>
          <div class="w-8">
            {@html iconRight}
          </div>
          <div class="flex-1">
            <div class="label">Drop-off</div>
            <div class="value">{quote.details.dropoff.name}</div>
            <div>{dayjs(quote.details.date_end).format("DD/MM/YYYY (ddd)")}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
