<script>
  export let specs = [];
</script>
<section class="p-5 mb-5">
  <h2 class="text-xl font-bold mb-4">Specifications</h2>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
    {#each specs as spec, index}
      <div class="pb-5 font-sm border-b border-gray-200">
        <div class="font-medium mb-1">{spec.Title}</div>
        <div class="text-gray-500">{spec.Description}</div>
      </div>
    {/each}
  </div>
</section>
