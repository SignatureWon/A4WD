<script>
  import { env } from "$env/dynamic/public";
  export let record = {};
</script>

<div class="h-96 bg-black/20">
  {#if record.image}
    <img
      src="{env.PUBLIC_URL}/storage/v1/object/public/contents/{record.image}"
      alt={record.name}
      class="object-fill h-96"
    />
  {/if}
</div>
