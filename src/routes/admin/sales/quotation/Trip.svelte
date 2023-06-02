<script>
  import { env } from "$env/dynamic/public";
  import dayjs from "dayjs";

  export let info;
</script>

<div class="grid grid-cols-1 md:grid-cols-3 py-4 gap-4">
  <div class="text-center">
    <img
      src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{info.vehicle
        .image}?width=200&height=200&resize=contain"
      alt={info.vehicle.name}
    />
  </div>
  <div class="col-span-2">
    <h2 class="text-lg font-bold mb-4">{info.vehicle.name}</h2>
    <div class="flex items-center justify-between py-2">
      <div class="w-5/12">
        <div class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400">Pick-up</div>
        <div class="font-bold text-lg">{info.quote.pickup.name}</div>
        <div>{dayjs(info.quote.pickup.date).format("DD/MM/YYYY (ddd)")}</div>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-4 h-4"
          fill="currentColor"
          ><path fill="none" d="M0 0h24v24H0z" /><path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
          /></svg
        >
      </div>
      <div class="w-5/12">
        <div class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400">Drop-off</div>
        <div class="font-bold text-lg">{info.quote.dropoff.name}</div>
        <div>{dayjs(info.quote.dropoff.date).format("DD/MM/YYYY (ddd)")}</div>
      </div>
    </div>
  </div>
</div>
