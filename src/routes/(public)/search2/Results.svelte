<script>
  export let results;
</script>

<section class="container xl:max-w-7xl mx-auto">
  {#each results as d}
    <div class="bg-white rounded">
      <div class="flex justify-between">
        <div class="flex">
          <div class="bg-brand-500 text-white text-xs uppercase px-1 py-0.5 rounded-b ml-1">
            {#if d.license_id}
              {d.license_name}
            {:else}
              Any license
            {/if}
          </div>
          <div class="bg-brand-500 text-white text-xs uppercase px-1 py-0.5 rounded-b ml-1">
            {d.age_name}
          </div>
        </div>
        <div>
          {#if d.special_total > 0}
            <div class="flex">
              {#each d.special_items as item}
                <div class="bg-red-500 text-white text-xs uppercase px-1 py-0.5 rounded-b ml-1">
                  {item.name}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
      <div class="px-4 pb-4">
        <h2 class="h2">{d.vehicle_name}</h2>
      </div>
    </div>
  {/each}
</section>
