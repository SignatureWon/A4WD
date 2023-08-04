<script>
  import { env } from "$env/dynamic/public";
  import VehicleFeatures from "../../single/VehicleFeatures.svelte";
  export let record = {};
</script>

<a href="/vehicles/{record.slug}">
  <div class="bg-white rounded h-full overflow-hidden group">
    <div class="bg-white rounded h-full overflow-hidden group">
      <a href="/vehicles/{record.slug}">
        <div class="h-full flex flex-col">
          <div class="h-60 sm:h-48 overflow-hidden">
            <div
              class="h-60 sm:h-48 bg-cover bg-center transition-all group-hover:scale-125"
              style={record.image
                ? `background-image: url('${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/${record.image}')`
                : "background-color: #dee1e7"}
            />
          </div>
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="font-bold mb-2">{record.name}</h3>
            <div class="flex-1">
              <VehicleFeatures {record} size="small" />
            </div>
          </div>
        </div>
      </a>
    </div>
  </div>
</a>
