<script>
  import { Button } from "carbon-components-svelte";
</script>

<!-- Page Container -->
<div id="page-container" class="flex flex-col mx-auto w-full bg-gray-100">
  <!-- Page Content -->
  <main id="page-content" class="flex flex-auto flex-col max-w-full">
    <div class="bg-white flex items-center relative overflow-hidden">
      <!-- Error Content -->
      <div
        class="text-center space-y-10 relative container xl:max-w-7xl mx-auto px-4 py-16 lg:px-8"
      >
        <div>
          <div
            class="text-6xl md:text-9xl font-extrabold mb-10 md:mb-20 inline-block relative"
          >
            <div class="absolute inset-0 border-4 border-red-50 animate-ping" />
            <span
              class="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500 relative"
            >
              404
            </span>
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
            Page Not Found
          </h2>
          <h3
            class="text-lg md:text-xl md:leading-relaxed font-medium text-gray-600 lg:w-2/3 mx-auto"
          >
            We are sorry but the page you are looking for was not found..
          </h3>
        </div>
        <div>
          <Button href="/">Back to home</Button>
        </div>
      </div>
      <!-- END Error Content -->
    </div>
  </main>
  <!-- END Page Content -->
</div>
<!-- END Page Container -->
