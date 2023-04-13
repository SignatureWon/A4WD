<script>
  import { env } from "$env/dynamic/public";
  export let record = {};
</script>

<a href="/vehicles/{record.slug}">
  <div class="bg-white rounded overflow-hidden group">
    <div class="bg-white rounded overflow-hidden group">
      <a href="/vehicles/{record.slug}">
        <div class="h-60 sm:h-48 overflow-hidden">
          <div
            class="h-60 sm:h-48 bg-cover bg-center transition-all group-hover:scale-125 bg-gray-300"
            style="background-image: url('{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{record.image}');"
          />
        </div>
        <div class="p-4">
          <h3 class="font-bold mb-2">{record.name}</h3>
        </div>
      </a>
    </div>
  </div>
</a>
