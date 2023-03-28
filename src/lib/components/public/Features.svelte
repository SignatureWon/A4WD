<script>
  export let title = {
    name: "",
    subtitle: "",
    description: "",
  };
  export let records = [];

  const colors = [
    "bg-red-600",
    "bg-yellow-600",
    "bg-green-600",
    "bg-cyan-600",
    "bg-blue-600",
    "bg-purple-600",
    "bg-pink-600",
    "bg-orange-600",
    "bg-lime-600",
    "bg-teal-600",
    "bg-sky-600",
    "bg-violet-600",
    "bg-rose-600",
  ];
</script>

<div class="bg-gray-100 overflow-hidden">
  <div class="container xl:max-w-7xl mx-auto px-4 py-12">
    <div
      class="flex flex-col lg:flex-row lg:items-center space-y-12 lg:space-y-0 lg:space-x-20"
    >
      <div class="lg:w-5/12 xl:w-5/12 md:py-12 space-y-10">
        <div>
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
              class="text-lg md:text-xl md:leading-relaxed font-medium text-gray-600"
            >
              {title.description}
            </p>
          {/if}
        </div>
      </div>

      <div class="lg:w-7/12 xl:w-7/12 flex-none relative">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          {#each records as item, index}
            <div class="bg-white p-5 rounded">
              <div
                class="inline-flex items-center justify-center w-10 h-10 m-2 mb-6 relative"
              >
                <div
                  class="absolute inset-0 rounded-3xl -m-2 transform rotate-6 {colors[
                    index
                  ]} bg-opacity-30"
                />
                <div
                  class="absolute inset-0 rounded-2xl transform -rotate-6 {colors[
                    index
                  ]}"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="text-white z-10 w-5 h-5"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M12 18.26l-7.053 3.948 1.575-7.928L.587 8.792l8.027-.952L12 .5l3.386 7.34 8.027.952-5.935 5.488 1.575 7.928z"
                  /></svg
                >
              </div>

              <h4 class="text-lg font-bold mb-2">{item.name}</h4>
              <p class="leading-relaxed text-gray-600">
                {item.content}
              </p>
            </div>
          {/each}
        </div>
      </div>
      <!-- END Features in Cards -->
    </div>
  </div>
</div>
