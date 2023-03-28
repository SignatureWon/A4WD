<script>
  // import SearchForm from "$lib/components/public/SearchForm.svelte";
  import Banners from "$lib/components/public/Banners.svelte";
  import Destinations from "$lib/components/public/Destinations.svelte";
  import Testimonials from "$lib/components/public/Testimonials.svelte";
  import Faqs from "$lib/components/public/Faqs.svelte";
  import LatestArticles from "$lib/components/public/LatestArticles.svelte";
  import Features from "$lib/components/public/Features.svelte";
  import PageHeader from "$lib/components/public/PageHeader.svelte";

  export let data;
  // console.log(data);

  const getContent = (contentType) => {
    let resp = data.contents.filter(function (item) {
      return item.type === contentType;
    });
    return resp;
  };

  // const tabs = [
  //   {
  //     name: "4WD/Motorhome",
  //     icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 20H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11l2.48-5.788A2 2 0 0 1 6.32 4H17.68a2 2 0 0 1 1.838 1.212L22 11v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zm1-7H4v5h16v-5zM4.176 11h15.648l-2.143-5H6.32l-2.143 5zM6.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>`,
  //   },
  //   {
  //     name: "Accommodations",
  //     icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M22 21H2v-2h1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5h2v10h1v2zm-5-2h2v-8h-6v8h2v-6h2v6zm0-10V5H5v14h6V9h6zM7 11h2v2H7v-2zm0 4h2v2H7v-2zm0-8h2v2H7V7z"/></svg>`,
  //   },
  //   {
  //     name: "Tours",
  //     icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 6.143v12.824l5.065-2.17 6 3L20 17.68V4.857l1.303-.558a.5.5 0 0 1 .697.46V19l-7 3-6-3-6.303 2.701a.5.5 0 0 1-.697-.46V7l2-.857zm12.243 5.1L12 15.485l-4.243-4.242a6 6 0 1 1 8.486 0zM12 12.657l2.828-2.829a4 4 0 1 0-5.656 0L12 12.657z"/></svg>`,
  //   },
  //   {
  //     name: "Yachts",
  //     icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 10.4V4a1 1 0 0 1 1-1h5V1h4v2h5a1 1 0 0 1 1 1v6.4l1.086.326a1 1 0 0 1 .682 1.2l-1.516 6.068a4.992 4.992 0 0 1-1.902-.272l1.25-5.352L12 10l-7.6 2.37 1.25 5.351a4.992 4.992 0 0 1-1.902.273l-1.516-6.068a1 1 0 0 1 .682-1.2L4 10.4zm2-.6L12 8l6 1.8V5H6v4.8zM4 20a5.978 5.978 0 0 0 4-1.528A5.978 5.978 0 0 0 12 20a5.978 5.978 0 0 0 4-1.528A5.978 5.978 0 0 0 20 20h2v2h-2a7.963 7.963 0 0 1-4-1.07A7.963 7.963 0 0 1 12 22a7.963 7.963 0 0 1-4-1.07A7.963 7.963 0 0 1 4 22H2v-2h2z"/></svg>`,
  //   },
  // ];

  // let selectedTab = 0;

  // const listing = [
  //   {
  //     title: "Popular Title One",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetuer elteret adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cumis",
  //     image:
  //       "https://cdn.tailkit.com/media/placeholders/photo-73F4pKoUkM0-800x600.jpg",
  //     link: "/",
  //     sale: "$250/day",
  //     price: "#300/day",
  //     badge: "New",
  //     discount: "-20% off",
  //   },
  //   {
  //     title: "Popular Title Two",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetuer elteret adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cumis",
  //     image:
  //       "https://cdn.tailkit.com/media/placeholders/photo-phIFdC6lA4E-800x600.jpg",
  //     link: "/",
  //     sale: "$250/day",
  //     price: "#300/day",
  //     badge: "New",
  //     discount: "-20% off",
  //   },
  //   {
  //     title: "Popular Title Three",
  //     description:
  //       "Lorem ipsum dolor sit amet, consectetuer elteret adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cumis",
  //     image:
  //       "https://cdn.tailkit.com/media/placeholders/photo-T7K4aEPoGGk-800x600.jpg",
  //     link: "/",
  //     sale: "$250/day",
  //     price: "#300/day",
  //     badge: "New",
  //     discount: "-20% off",
  //   },
  // ];

  // console.log(getContent("destinations"));
</script>

<PageHeader>
  <Banners records={getContent("banners")} />
</PageHeader>

<Destinations records={getContent("destinations")} title={data.site.destinations} />
<Features records={getContent("features")} title={data.site.features} />
<LatestArticles records={data.blog} title={data.site.blog} />
<Testimonials records={getContent("testimonials")} title={data.site.testimonials} />
<Faqs records={getContent("faqs")} title={data.site.faqs} />

<!-- <div class="bg-white">
  <div class="container mx-auto border border-gray-200">
    <div class="flex justify-center border-b border-gray-200">
      <ButtonSet class="border-x border-gray-200">
        {#each tabs as tab, tabIndex}
          <Button
            kind="ghost"
            class={`flex border-0 border-b-2 text-gray-600 ${
              selectedTab === tabIndex
                ? "border-brand-600 text-brand-600"
                : "border-transparent"
            }`}
            on:click={() => (selectedTab = tabIndex)}
          >
            {@html tab.icon}
            <span class="hidden sm:inline-block ml-2">{tab.name}</span>
          </Button>
        {/each}
      </ButtonSet>
    </div>
    <div class="p-4">
      <div class={selectedTab === 0 ? "block" : "hidden"}>
        <div class="grid md:grid-cols-12 gap-4 py-4">
          <div class="md:col-span-6 lg:col-span-4 flex">
            <Select
              labelText="Pick up"
              on:change={(e) => console.log("value", e.target.value)}
            >
              <SelectItem value="Adelaide" text="Adelaide" />
              <SelectItem value="Alice-Springs" text="Alice Springs" />
              <SelectItem value="Brisbane" text="Brisbane" />
              <SelectItem value="Broome" text="Broome" />
              <SelectItem value="Cairns" text="Cairns" />
              <SelectItem value="Darwin" text="Darwin" />
              <SelectItem value="Hobart" text="Hobart" />
              <SelectItem value="Melbourne" text="Melbourne" />
              <SelectItem value="Perth" text="Perth" />
              <SelectItem value="Sydney" text="Sydney" />
            </Select>
            <Select
              labelText="Drop off"
              class="-ml-1"
              on:change={(e) => console.log("value", e.target.value)}
            >
              <SelectItem value="Adelaide" text="Adelaide" />
              <SelectItem value="Alice-Springs" text="Alice Springs" />
              <SelectItem value="Brisbane" text="Brisbane" />
              <SelectItem value="Broome" text="Broome" />
              <SelectItem value="Cairns" text="Cairns" />
              <SelectItem value="Darwin" text="Darwin" />
              <SelectItem value="Hobart" text="Hobart" />
              <SelectItem value="Melbourne" text="Melbourne" />
              <SelectItem value="Perth" text="Perth" />
              <SelectItem value="Sydney" text="Sydney" />
            </Select>
          </div>
          <div class="md:col-span-6 lg:col-span-4 flex">
            <DatePicker datePickerType="range" on:change>
              <DatePickerInput
                labelText="Start date"
                placeholder="mm/dd/yyyy"
              />
              <DatePickerInput
                class="-ml-1"
                labelText="End date"
                placeholder="mm/dd/yyyy"
              />
            </DatePicker>
          </div>
          <div class="md:col-span-6 lg:col-span-3 flex">
            <Select
              labelText="Driver license"
              on:change={(e) => console.log("value", e.target.value)}
            >
              <SelectItem value="AU/NZ" text="AU/NZ" />
              <SelectItem value="Other" text="Other" />
            </Select>
            <Select
              labelText="Driver age"
              class="-ml-1"
              on:change={(e) => console.log("value", e.target.value)}
            >
              <SelectItem value="18-20" text="18-20" />
              <SelectItem value="21+" text="21+" />
            </Select>
          </div>
          <div class="md:col-span-6 lg:col-span-1">
            <Button class="md:mt-6 w-full flex justify-center items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                class="w-4 h-4"
                fill="currentColor"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path
                  d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"
                />
              </svg>
              <span class="lg:hidden ml-2">Search</span>
            </Button>
          </div>
        </div>
      </div>
      <div class={selectedTab === 1 ? "block" : "hidden"}>1</div>
      <div class={selectedTab === 2 ? "block" : "hidden"}>2</div>
      <div class={selectedTab === 3 ? "block" : "hidden"}>3</div>
    </div>
    <div
      class="h-80 bg-cover bg-center"
      style="background-image: url('https://storea4wdr1.blob.core.windows.net/billboard-lg/2adc275b-98c4-4222-92a7-3b688779387b');"
    >
      <div
        class="w-full h-full bg-brand-900/50 flex flex-col items-center justify-center"
      >
        <div class="text-white text-5xl font-bold">Experience Australia</div>
        <div class="text-brand-400 text-2xl mb-4">
          Live the adventure in the Britz
        </div>
        <Button>Learn more</Button>
      </div>
    </div>
  </div>
</div> -->
<!-- Features Section: Vertical Cards -->

<!-- END Blog List Section: Modern Grid -->

<!-- Testimonials Section: Boxed Multiple Alternate -->
<!-- END Testimonials Section: Boxed Multiple Alternate -->

<!-- FAQ Section: To The Side -->
<!-- END FAQ Section: To The Side -->

<!-- Contact Section: With Image Cover Brand -->
