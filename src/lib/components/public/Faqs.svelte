<script>
  export let records = [];
</script>

<div class="bg-white">
  <div
    class="lg:flex space-y-8 lg:justify-between lg:space-x-8 lg:space-y-0 container xl:max-w-7xl mx-auto px-4 py-16"
  >
    <!-- Heading -->
    <div class="text-center lg:text-left">
      <div
        class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
      >
        We Answer
      </div>
      <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
        Frequently Asked Questions
      </h2>
      <h3
        class="text-lg md:text-xl md:leading-relaxed font-medium text-gray-600"
      >
        Be sure to <a href="/" class="text-brand-600 hover:text-brand-400"
          >get in touch</a
        > and let us know if you have any further questions.
      </h3>
    </div>
    <!-- END Heading -->

    <!-- FAQ -->
    <div class="space-y-8 lg:w-3/5 lg:flex-none">
      {#each records as item}
        <div class="">
          <h4 class="font-bold text-lg mb-2">{item.name}</h4>
          <p class="text-gray-600">{item.description}</p>
        </div>
      {/each}
    </div>
    <!-- END FAQ -->
  </div>
</div>
