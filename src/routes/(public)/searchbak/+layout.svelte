<script>
  import SearchForm from "$lib/components/public/SearchForm.svelte";
</script>

<div class="p-4">
  <div class="lg:flex">
    <div class="lg:w-96 mb-4">
      <SearchForm />
    </div>
    <div class="lg:flex-1 px-4">
      <slot />
    </div>
  </div>
</div>
