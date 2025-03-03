<script>
  import { env } from "$env/dynamic/public";
  export let title;
  export let image;
</script>

<div
  class="h-full bg-cover bg-center"
  style="background-image: url('{env.PUBLIC_DB_URL}/storage/v1/object/public/contents/{image}');"
>
  <div class="w-full h-full bg-black/50 flex flex-col items-center justify-center text-center px-5 py-32 lg:py-5">
    <h1 class="text-4xl font-bold text-white">{title}</h1>
  </div>
</div>
