<script>
  import SearchForm from "$lib/components/public/SearchForm.svelte";
</script>

<section class="bg-brand-600 p-5">
  <div class="container xl:max-w-7xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <SearchForm />

      <div class="col-span-2">
        <slot />
      </div>
    </div>
  </div>
</section>
