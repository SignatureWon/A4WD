<script>
  export let pageTitle;
</script>

<div class="bg-brand-900 h-full flex flex-col items-center justify-center text-center text-white px-5 py-10">
  <h1 class="text-4xl font-bold text-white mb-1">{pageTitle.name}</h1>
  <div class="text-brand-200 text-2xl">
    {pageTitle.subtitle}
  </div>
</div>
