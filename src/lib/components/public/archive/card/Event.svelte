<script>
  import { env } from "$env/dynamic/public";
  export let record = {};
  // console.log(record);
</script>

<a href="/events/{record.slug}">
  <div class="bg-white rounded overflow-hidden group">
    <div class="bg-white rounded overflow-hidden group">
      <a href="/events/{record.slug}">
        <div class="h-60 sm:h-48 overflow-hidden">
          <div
            class="h-60 sm:h-48 bg-cover bg-center transition-all group-hover:scale-125"
            style={record.image
              ? `background-image: url('${env.PUBLIC_DB_URL}/storage/v1/object/public/contents/${record.image}')`
              : "background-color: #dee1e7"}
          />
        </div>
        <div class="p-4">
          <h3 class="font-bold mb-2">{record.name}</h3>
        </div>
      </a>
    </div>
  </div>
</a>
