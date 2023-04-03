<script>
  export let records = [];
  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };
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
        {title.name}
      </div>
      <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
        {title.subtitle}
      </h2>
      {#if title.description}
        <p
          class="mb-4 text-xl text-gray-600"
        >
          {@html title.description}
        </p>
      {/if}
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
