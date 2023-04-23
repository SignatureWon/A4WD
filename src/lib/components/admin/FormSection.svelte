<script>
  export let title = null;
  export let description = null;
</script>

<section class="md:flex py-5 mb-5">
  {#if title}
    <div class="px-5 w-72">
      <h2 class="text-lg font-medium mb-2">{title}</h2>
      {#if description}
        <div class="text-gray-500">
          {description}
        </div>
      {/if}
    </div>
  {/if}
  <div class="px-5 flex-1">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <slot />
    </div>
  </div>
</section>
