<script>
  import { ProgressIndicator, ProgressStep } from "carbon-components-svelte";
  // import SearchForm from "$lib/components/public/SearchForm2.svelte";
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
<!-- <aside class="aside_search">
</aside>
<main class="main_content">
  <header class="px-4 h-12 border-t-4 border-brand-600 bg-gray-200">
    <ProgressIndicator preventChangeOnClick spaceEqually currentIndex={0}>
      <ProgressStep
        complete={false}
        label="Select"
        description="The progress indicator will listen for clicks on the steps"
      />
      <ProgressStep
        complete={false}
        label="Details"
        description="The progress indicator will listen for clicks on the steps"
      />
      <ProgressStep
        complete={false}
        label="Payment"
        description="The progress indicator will listen for clicks on the steps"
      />
    </ProgressIndicator>
  </header>
  <section class="section_results">
    <slot />
  </section>
</main> -->
