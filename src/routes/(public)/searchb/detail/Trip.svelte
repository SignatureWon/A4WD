<script>
  import dayjs from "dayjs";
  import { env } from "$env/dynamic/public";

  export let search = {}
  export let detail = {}
</script>

<section class="bg-white mb-8">
  <div class="px-4 py-2 border-b border-gray-200">
    <h2 class="text-xl font-bold">Trip Details</h2>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-3 p-4 gap-4">
    <div class="my-4 text-center">
      <img
        src="{env.PUBLIC_SUPABASE_URL}/storage/v1/render/image/public/contents/{detail.vehicle_image}?width=200&height=200&resize=contain"
        alt={detail.vehicle_caption}
      />
    </div>
    <div class="px-4 col-span-2">
      <h2 class="text-lg font-bold mb-4">{detail.vehicle_name}</h2>
      <div class="flex items-center justify-between py-2">
        <div class="w-5/12">
          <div
            class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400"
          >
            Pick-up
          </div>
          <div class="font-bold text-lg">{detail.depot_name}</div>
          <div>{dayjs(search.date_start).format("DD/MM/YYYY (ddd)")}</div>
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
          <div
            class="uppercase tracking-wider font-bold mb-1 text-xs text-gray-400"
          >
            Drop-off
          </div>
          <div class="font-bold text-lg">{detail.dropoff_name}</div>
          <div>{dayjs(search.date_end).format("DD/MM/YYYY (ddd)")}</div>
        </div>
      </div>
    </div>
  </div>
</section>
