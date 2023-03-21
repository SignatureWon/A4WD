<script>
  import SearchForm from "$lib/components/public/SearchForm.svelte";
  import Banners from "$lib/components/public/Banners.svelte";
  import {
    Button,
    ButtonSet,
    DatePicker,
    DatePickerInput,
    OverflowMenu,
    OverflowMenuItem,
    Select,
    SelectItem,
    Tab,
    TabContent,
    Tabs,
    Tag,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";

  export let data;

  const getContent = (contentType) => {
    let resp = data.contents.filter(function (item) {
      return item.type === contentType;
    });
    return resp;
  };

  // console.log(getContent("announcements"));

  const tabs = [
    {
      name: "4WD/Motorhome",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 20H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11l2.48-5.788A2 2 0 0 1 6.32 4H17.68a2 2 0 0 1 1.838 1.212L22 11v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zm1-7H4v5h16v-5zM4.176 11h15.648l-2.143-5H6.32l-2.143 5zM6.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>`,
    },
    {
      name: "Accommodations",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M22 21H2v-2h1V4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v5h2v10h1v2zm-5-2h2v-8h-6v8h2v-6h2v6zm0-10V5H5v14h6V9h6zM7 11h2v2H7v-2zm0 4h2v2H7v-2zm0-8h2v2H7V7z"/></svg>`,
    },
    {
      name: "Tours",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 6.143v12.824l5.065-2.17 6 3L20 17.68V4.857l1.303-.558a.5.5 0 0 1 .697.46V19l-7 3-6-3-6.303 2.701a.5.5 0 0 1-.697-.46V7l2-.857zm12.243 5.1L12 15.485l-4.243-4.242a6 6 0 1 1 8.486 0zM12 12.657l2.828-2.829a4 4 0 1 0-5.656 0L12 12.657z"/></svg>`,
    },
    {
      name: "Yachts",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 10.4V4a1 1 0 0 1 1-1h5V1h4v2h5a1 1 0 0 1 1 1v6.4l1.086.326a1 1 0 0 1 .682 1.2l-1.516 6.068a4.992 4.992 0 0 1-1.902-.272l1.25-5.352L12 10l-7.6 2.37 1.25 5.351a4.992 4.992 0 0 1-1.902.273l-1.516-6.068a1 1 0 0 1 .682-1.2L4 10.4zm2-.6L12 8l6 1.8V5H6v4.8zM4 20a5.978 5.978 0 0 0 4-1.528A5.978 5.978 0 0 0 12 20a5.978 5.978 0 0 0 4-1.528A5.978 5.978 0 0 0 20 20h2v2h-2a7.963 7.963 0 0 1-4-1.07A7.963 7.963 0 0 1 12 22a7.963 7.963 0 0 1-4-1.07A7.963 7.963 0 0 1 4 22H2v-2h2z"/></svg>`,
    },
  ];

  let selectedTab = 0;

  const listing = [
    {
      title: "Popular Title One",
      description:
        "Lorem ipsum dolor sit amet, consectetuer elteret adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cumis",
      image:
        "https://cdn.tailkit.com/media/placeholders/photo-73F4pKoUkM0-800x600.jpg",
      link: "/",
      sale: "$250/day",
      price: "#300/day",
      badge: "New",
      discount: "-20% off",
    },
    {
      title: "Popular Title Two",
      description:
        "Lorem ipsum dolor sit amet, consectetuer elteret adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cumis",
      image:
        "https://cdn.tailkit.com/media/placeholders/photo-phIFdC6lA4E-800x600.jpg",
      link: "/",
      sale: "$250/day",
      price: "#300/day",
      badge: "New",
      discount: "-20% off",
    },
    {
      title: "Popular Title Three",
      description:
        "Lorem ipsum dolor sit amet, consectetuer elteret adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa cumis",
      image:
        "https://cdn.tailkit.com/media/placeholders/photo-T7K4aEPoGGk-800x600.jpg",
      link: "/",
      sale: "$250/day",
      price: "#300/day",
      badge: "New",
      discount: "-20% off",
    },
  ];
</script>

<section class="bg-brand-600 p-5">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 lg:grid-cols-3">
      <SearchForm />

      <div class="col-span-2">
        <Banners />
      </div>
    </div>
  </div>
</section>

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
<div class="bg-white overflow-hidden">
  <div class="container xl:max-w-7xl mx-auto px-4 py-12">
    <div
      class="flex flex-col lg:flex-row lg:items-center space-y-12 lg:space-y-0 lg:space-x-20"
    >
      <!-- Heading -->
      <div class="lg:w-5/12 xl:w-5/12 md:py-12 space-y-10">
        <div>
          <div
            class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
          >
            Why choose us?
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
            Amazing features packed in a neat package
          </h2>
          <h3
            class="text-lg md:text-xl md:leading-relaxed font-medium text-gray-600"
          >
            As a licensed 4WD, Motorhome, Camper and Car specialist Travel Agent
            we assist you with your planning, vacation or holiday in Australia.
          </h3>
        </div>
      </div>
      <!-- END Heading -->

      <!-- Features in Cards -->
      <div class="lg:w-7/12 xl:w-7/12 flex-none relative">
        <div
          class="pattern-dots-xl opacity-10 absolute top-0 left-0 w-48 h-64 md:mt-20 transform -translate-x-10 -translate-y-10"
        />
        <div
          class="pattern-dots-xl opacity-10 absolute bottom-0 right-0 w-48 h-64 md:mb-20 transform translate-x-10 translate-y-10"
        />
        <div
          class="relative flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0"
        >
          <div class="md:w-1/2 md:mt-12 space-y-6">
            <div
              class="group bg-white p-5 transition ease-out duration-200 border border-gray-200 rounded hover:border-orange-300"
            >
              <div
                class="inline-flex items-center justify-center w-10 h-10 m-2 mb-6 relative"
              >
                <div
                  class="absolute inset-0 rounded-3xl -m-2 transform rotate-6 bg-orange-300 transition ease-out duration-200 group-hover:-rotate-3 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 rounded-2xl transform -rotate-6 bg-orange-700 bg-opacity-75 shadow-inner transition ease-out duration-200 group-hover:rotate-2 group-hover:scale-105"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="text-white relative transform transition ease-out duration-200 group-hover:scale-110 hi-solid hi-adjustments inline-block w-5 h-5"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M4 2h16a1 1 0 0 1 1 1v19.276a.5.5 0 0 1-.704.457L12 19.03l-8.296 3.702A.5.5 0 0 1 3 22.276V3a1 1 0 0 1 1-1zm8 11.5l2.939 1.545-.561-3.272 2.377-2.318-3.286-.478L12 6l-1.47 2.977-3.285.478 2.377 2.318-.56 3.272L12 13.5z"
                  /></svg
                >
              </div>
              <h4 class="text-lg font-bold mb-2">Expert Knowledge</h4>
              <p class="leading-relaxed text-gray-600">
                As a fully-licensed 4WD, Motorhome, Camper and Car specialist
                Travel Agent we have everything you need to plan that perfect
                self-drive vacation!
              </p>
            </div>
            <div
              class="group bg-white p-5 transition ease-out duration-200 border border-gray-200 rounded hover:border-red-300"
            >
              <div
                class="inline-flex items-center justify-center w-10 h-10 m-2 mb-6 relative"
              >
                <div
                  class="absolute inset-0 rounded-3xl -m-2 transform rotate-6 bg-red-300 transition ease-out duration-200 group-hover:-rotate-3 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 rounded-2xl transform -rotate-6 bg-red-700 bg-opacity-75 shadow-inner transition ease-out duration-200 group-hover:rotate-2 group-hover:scale-105"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="text-white relative transform transition ease-out duration-200 group-hover:scale-110 hi-solid hi-adjustments inline-block w-5 h-5"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M10.9 2.1l9.899 1.415 1.414 9.9-9.192 9.192a1 1 0 0 1-1.414 0l-9.9-9.9a1 1 0 0 1 0-1.414L10.9 2.1zm2.828 8.486a2 2 0 1 0 2.828-2.829 2 2 0 0 0-2.828 2.829z"
                  /></svg
                >
              </div>
              <h4 class="text-lg font-bold mb-2">Great Prices</h4>
              <p class="leading-relaxed text-gray-600">
                We work with top-notch self-drive suppliers and have access to a
                large list of quality 2WD and 4WD rentals at excellent rates.
              </p>
            </div>
          </div>
          <div class="md:w-1/2 space-y-6">
            <div
              class="group bg-white p-5 transition ease-out duration-200 border border-gray-200 rounded hover:border-emerald-300"
            >
              <div
                class="inline-flex items-center justify-center w-10 h-10 m-2 mb-6 relative"
              >
                <div
                  class="absolute inset-0 rounded-3xl -m-2 transform rotate-6 bg-emerald-300 transition ease-out duration-200 group-hover:-rotate-3 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 rounded-2xl transform -rotate-6 bg-emerald-700 bg-opacity-75 shadow-inner transition ease-out duration-200 group-hover:rotate-2 group-hover:scale-105"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="text-white relative transform transition ease-out duration-200 group-hover:scale-110 hi-solid hi-adjustments inline-block w-5 h-5"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M14.121 10.48a1 1 0 0 0-1.414 0l-.707.706a2 2 0 1 1-2.828-2.828l5.63-5.632a6.5 6.5 0 0 1 6.377 10.568l-2.108 2.135-4.95-4.95zM3.161 4.468a6.503 6.503 0 0 1 8.009-.938L7.757 6.944a4 4 0 0 0 5.513 5.794l.144-.137 4.243 4.242-4.243 4.243a2 2 0 0 1-2.828 0L3.16 13.66a6.5 6.5 0 0 1 0-9.192z"
                  /></svg
                >
              </div>
              <h4 class="text-lg font-bold mb-2">Personalised Service</h4>
              <p class="leading-relaxed text-gray-600">
                You can contact us through email or over the phone and one of
                our friendly reservations staff will reply to you within 24
                hours - usually much sooner.
              </p>
            </div>
            <div
              class="group bg-white p-5 transition ease-out duration-200 border border-gray-200 rounded hover:border-purple-300"
            >
              <div
                class="inline-flex items-center justify-center w-10 h-10 m-2 mb-6 relative"
              >
                <div
                  class="absolute inset-0 rounded-3xl -m-2 transform rotate-6 bg-purple-300 transition ease-out duration-200 group-hover:-rotate-3 group-hover:scale-105"
                />
                <div
                  class="absolute inset-0 rounded-2xl transform -rotate-6 bg-purple-700 bg-opacity-75 shadow-inner transition ease-out duration-200 group-hover:rotate-2 group-hover:scale-105"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  class="text-white relative transform transition ease-out duration-200 group-hover:scale-110 hi-solid hi-adjustments inline-block w-5 h-5"
                  fill="currentColor"
                  ><path fill="none" d="M0 0h24v24H0z" /><path
                    d="M15.224 15.508l-2.213 4.65a.6.6 0 0 1-.977.155l-3.542-3.739a.6.6 0 0 0-.357-.182l-5.107-.668a.6.6 0 0 1-.449-.881l2.462-4.524a.6.6 0 0 0 .062-.396L4.16 4.86a.6.6 0 0 1 .7-.7l5.063.943a.6.6 0 0 0 .396-.062l4.524-2.462a.6.6 0 0 1 .881.45l.668 5.106a.6.6 0 0 0 .182.357l3.739 3.542a.6.6 0 0 1-.155.977l-4.65 2.213a.6.6 0 0 0-.284.284zm.797 1.927l1.414-1.414 4.243 4.242-1.415 1.415-4.242-4.243z"
                  /></svg
                >
              </div>
              <h4 class="text-lg font-bold mb-2">Travel Tips</h4>
              <p class="leading-relaxed text-gray-600">
                Read our blog and find out all you need to know about putting
                together the perfect Australian self-drive holiday!
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- END Features in Cards -->
    </div>
  </div>
</div>
<!-- END Features Section: Vertical Cards -->
<!-- Blog List Section: In Grid -->
{#each ["4WD/Motorhomes", "Accommodations", "Tours", "Yachts"] as section}
  <div class="bg-gray-100">
    <div class="space-y-4 container xl:max-w-7xl mx-auto px-4 py-16">
      <!-- Heading -->
      <div>
        <div
          class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
        >
          Popular
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold mb-4">{section}</h2>
      </div>
      <!-- END Heading -->

      <!-- Blog Posts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {#each listing as item}
          <div class="bg-white rounded overflow-hidden shadow-sm">
            <a
              href={item.link}
              class="block relative group h-40 bg-cover bg-center"
              style="background-image: url('{item.image}');"
              title={item.title}
            >
              <div
                class="flex items-center justify-center absolute inset-0 bg-brand-600 bg-opacity-75 opacity-0 transition ease-out duration-150 group-hover:opacity-100"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  class="text-white transform -rotate-45 hi-solid hi-arrow-right inline-block w-10 h-10"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="flex justify-between">
                <div>
                  <Tag class="bg-brand-100 text-brand-600 font-bold uppercase"
                    >{item.badge}</Tag
                  >
                </div>
                <div>
                  <Tag class="bg-brand-600 text-white font-bold uppercase"
                    >{item.discount}</Tag
                  >
                </div>
              </div>
            </a>
            <div class="p-4">
              <div class="flex">
                <h4 class="font-bold text-lg sm:text-xl mb-2 pr-4 grow">
                  <a
                    href={item.link}
                    class="leading-7 text-gray-800 hover:text-gray-600"
                    >{item.title}</a
                  >
                </h4>
                <div class="w-24">
                  <div class="text-gray-300 text-xs uppercase tracking-wider">
                    From
                  </div>
                  <div class="font-medium text-brand-600">{item.sale}</div>
                  <div class="text-xs line-through text-gray-400">
                    {item.sale}
                  </div>
                </div>
              </div>
              <p class="text-gray-400">
                {item.description}
              </p>
            </div>
          </div>
        {/each}
      </div>
      <!-- END Blog Posts -->
      <div
        class="bg-white rounded shadow-sm grid md:grid-cols-2 lg:grid-cols-4"
      >
        {#each Array(3) as col}
          <div class="space-y-2 p-4">
            {#each Array(3) as item, itemIndex}
              <div>
                <a href="/" class="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    class="w-4 h-4 text-brand-600"
                    fill="currentColor"
                    ><path fill="none" d="M0 0h24v24H0z" /><path
                      d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"
                    /></svg
                  >
                  <span class="ml-2 truncate">More {section} {itemIndex}</span>
                </a>
              </div>
            {/each}
          </div>
        {/each}
        <div class="p-4 flex flex-col bg-brand-600 justify-center">
          <div
            class="text-xs uppercase tracking-wider text-left text-brand-200"
          >
            View all
          </div>
          <a href="/" class="font-bold text-white">{section}</a>
        </div>
      </div>
    </div>
  </div>
{/each}
<!-- END Blog List Section: In Grid -->
<!-- Blog List Section: Modern Grid -->
<div class="bg-white">
  <div class="space-y-8 container xl:max-w-7xl mx-auto px-4 py-16">
    <!-- Heading -->
    <div class="text-center">
      <div
        class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
      >
        Blog
      </div>
      <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
        Our latest travel tips
      </h2>
    </div>
    <!-- END Heading -->

    <!-- Blog Posts -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-12">
      <div class="flex flex-col lg:flex-row bg-white rounded-lg lg:col-span-4">
        <div class="lg:w-8/12">
          <a
            href="/"
            class="h-80 block rounded overflow-hidden bg-cover bg-center"
            style="background-image: url('https://storea4wdr1.blob.core.windows.net/blog-post-md/5ff637f4-e233-4859-adbf-cadf93168ae8')"
          >
            <!-- <div
              class="flex items-center justify-center absolute inset-0 bg-brand-600 bg-opacity-75 opacity-0 transition ease-out duration-150 group-hover:opacity-100"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="text-white transform -rotate-45 hi-solid hi-arrow-right inline-block w-10 h-10"
                ><path
                  fill-rule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                /></svg
              >
            </div> -->
          </a>
        </div>
        <div class="w-full lg:w-4/12 lg:pl-6">
          <p class="text-gray-600 text-sm font-medium mt-4 mb-2 lg:mt-0">
            Mar 3, 2022
          </p>
          <h4 class="font-bold text-lg sm:text-xl mb-2">
            <a href="/" class="leading-7 text-gray-800 hover:text-gray-600"
              >4WD How to setup and drive - videos</a
            >
          </h4>
          <p class="prose prose-indigo">
            Integer fermentum tincidunt auctor. Vestibulum ullamcorper, odio sed
            rhoncus imperdiet, enim elit sollicitudin orci, eget dictum leo mi
            nec lectus. Vestibulum ullamcorper, odio sed rhoncus imperdiet, enim
            elit sollicitudin orci, eget dictum leo mi nec lectus.
          </p>
        </div>
      </div>
      <div class="flex flex-col lg:col-span-2">
        <a
          href="/"
          class="h-80 rounded overflow-hidden bg-cover bg-center"
          style="background-image: url('https://storea4wdr1.blob.core.windows.net/blog-post-md/0e439672-bdbb-4018-a320-88a87d45d59a')"
        >
          <!-- <div
            class="flex items-center justify-center absolute inset-0 bg-brand-600 bg-opacity-75 opacity-0 transition ease-out duration-150 group-hover:opacity-100"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              class="text-white transform -rotate-45 hi-solid hi-arrow-right inline-block w-10 h-10"
              ><path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              /></svg
            >
          </div> -->
        </a>
        <p class="text-gray-600 text-sm font-medium mt-4 mb-2">Feb 23, 2022</p>
        <h4 class="font-bold text-lg sm:text-xl mb-2">
          <a href="/" class="leading-7 text-gray-800 hover:text-gray-600"
            >Apollo and Cheapa 4wd Rentals Travel Advise</a
          >
        </h4>
        <p class="prose prose-indigo">
          Integer fermentum tincidunt auctor. Vestibulum ullamcorper, odio sed
          rhoncus imperdiet, enim elit sollicitudin orci, eget dictum leo mi nec
          lectus.
        </p>
      </div>
      <div class="flex flex-col lg:col-span-2">
        <a
          href="/"
          class="h-80 rounded overflow-hidden bg-cover bg-center"
          style="background-image: url('https://storea4wdr1.blob.core.windows.net/blog-post-md/9449998c-6430-4791-b5ab-2fae8f5b9e01')"
        >
          <!-- <div
            class="flex items-center justify-center absolute inset-0 bg-brand-600 bg-opacity-75 opacity-0 transition ease-out duration-150 group-hover:opacity-100"
          >
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              class="text-white transform -rotate-45 hi-solid hi-arrow-right inline-block w-10 h-10"
              ><path
                fill-rule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clip-rule="evenodd"
              /></svg
            >
          </div> -->
        </a>
        <p class="text-gray-600 text-sm font-medium mt-4 mb-2">Feb 15, 2022</p>
        <h4 class="font-bold text-lg sm:text-xl mb-2">
          <a href="/" class="leading-7 text-gray-800 hover:text-gray-600"
            >Brisbane by 4WD</a
          >
        </h4>
        <p class="prose prose-indigo">
          Integer fermentum tincidunt auctor. Vestibulum ullamcorper, odio sed
          rhoncus imperdiet, enim elit sollicitudin orci, eget dictum leo mi nec
          lectus.
        </p>
      </div>
    </div>
    <!-- END Blog Posts -->
  </div>
</div>
<!-- END Blog List Section: Modern Grid -->

<!-- Testimonials Section: Boxed Multiple Alternate -->
<div class="bg-brand-50">
  <div class="space-y-8 container xl:max-w-7xl mx-auto px-4 py-16">
    <!-- Heading -->
    <div class="text-center">
      <div
        class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-600"
      >
        Testimonials
      </div>
      <h2
        class="text-3xl md:text-4xl font-extrabold mb-4 flex items-center justify-center"
      >
        Our customers love us
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="text-red-600 w-8 h-8 ml-2"
          fill="currentColor"
          ><path fill="none" d="M0 0H24V24H0z" /><path
            d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z"
          /></svg
        >
      </h2>
    </div>
    <!-- END Heading -->

    <!-- Feedback -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
      <div
        class="group flex flex-col px-6 pt-8 pb-6 md:px-8 md:pb-8 relative bg-white border border-gray-200 rounded-xl"
      >
        <div
          class="absolute top-0 right-0 text-7xl mt-3 mr-4 text-gray-200 opacity-75 font-serif"
        >
          “
        </div>
        <blockquote class="grow flex flex-col relative">
          <div class="mb-6">
            <div
              class="inline-flex items-center text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-lg transition ease-out origin-top-left group-hover:scale-110"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
            </div>
          </div>
          <p
            class="grow text-sm text-gray-700 font-medium leading-relaxed mb-5"
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aene an
            commodo ligula eget dolor. Aenean massa. Cum sociis
          </p>
          <footer class="flex-none flex items-center space-x-4">
            <a
              href="/"
              class="flex-none rounded-full overflow-hidden w-12 h-12 transform transition ease-out duration-150 border-2 border-gray-50 hover:border-white hover:shadow-md hover:scale-125 active:border-gray-50 active:shadow-sm active:scale-110"
            >
              <img
                src="https://cdn.tailkit.com/media/placeholders/avatar-sibVwORYqs0-160x160.jpg"
                alt="Avatar Photo"
              />
            </a>
            <div>
              <a
                href="/"
                class="font-semibold text-brand-600 hover:text-brand-400"
              >
                Alex Sader
              </a>
            </div>
          </footer>
        </blockquote>
      </div>
      <div
        class="group flex flex-col items-stretch px-6 pt-8 pb-6 md:px-8 md:pb-8 relative bg-white border border-gray-200 rounded-xl"
      >
        <div
          class="absolute top-0 right-0 text-7xl mt-3 mr-4 text-gray-200 opacity-75 font-serif"
        >
          “
        </div>
        <blockquote class="grow flex flex-col relative">
          <div class="mb-6">
            <div
              class="inline-flex items-center text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-lg transition ease-out origin-top-left group-hover:scale-110"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
            </div>
          </div>
          <p
            class="grow text-sm text-gray-700 font-medium leading-relaxed mb-5"
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aene an
            commodo ligula eget dolor. Aenean massa. Cum sociis
          </p>
          <footer class="flex-none flex items-center space-x-4">
            <a
              href="/"
              class="flex-none rounded-full overflow-hidden w-12 h-12 transform transition ease-out duration-150 border-2 border-gray-50 hover:border-white hover:shadow-md hover:scale-125 active:border-gray-50 active:shadow-sm active:scale-110"
            >
              <img
                src="https://cdn.tailkit.com/media/placeholders/avatar-DLKR_x3T_7s-160x160.jpg"
                alt="Avatar Photo"
              />
            </a>
            <div>
              <a
                href="/"
                class="font-semibold text-brand-600 hover:text-brand-400"
              >
                Sue Doe
              </a>
            </div>
          </footer>
        </blockquote>
      </div>
      <div
        class="group flex flex-col items-stretch px-6 pt-8 pb-6 md:px-8 md:pb-8 relative bg-white border border-gray-200 rounded-xl"
      >
        <div
          class="absolute top-0 right-0 text-7xl mt-3 mr-4 text-gray-200 opacity-75 font-serif"
        >
          “
        </div>
        <blockquote class="grow flex flex-col relative">
          <div class="mb-6">
            <div
              class="inline-flex items-center text-brand-600 bg-brand-50 border border-brand-100 px-2 py-1 rounded-lg transition ease-out origin-top-left group-hover:scale-110"
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                class="hi-solid hi-star inline-block w-5 h-5"
                ><path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                /></svg
              >
            </div>
          </div>
          <p
            class="grow text-sm text-gray-700 font-medium leading-relaxed mb-5"
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aene an
            commodo ligula eget dolor. Aenean massa. Cum sociis
          </p>
          <footer class="flex-none flex items-center space-x-4">
            <a
              href="/"
              class="flex-none rounded-full overflow-hidden w-12 h-12 transform transition ease-out duration-150 border-2 border-gray-50 hover:border-white hover:shadow-md hover:scale-125 active:border-gray-50 active:shadow-sm active:scale-110"
            >
              <img
                src="https://cdn.tailkit.com/media/placeholders/avatar-euZ2n8dGUcQ-160x160.jpg"
                alt="Avatar Photo"
              />
            </a>
            <div>
              <a
                href="/"
                class="font-semibold text-brand-600 hover:text-brand-400"
              >
                Mike Lee
              </a>
            </div>
          </footer>
        </blockquote>
      </div>
    </div>
    <!-- END Feedback -->
  </div>
</div>
<!-- END Testimonials Section: Boxed Multiple Alternate -->

<!-- FAQ Section: To The Side -->
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
      <div class="prose prose-indigo">
        <h4 class="font-bold text-lg mb-2">What features are included?</h4>
        <p class="text-gray-600">
          Etiam egestas fringilla enim, id convallis lectus laoreet at. Fusce
          purus nisi, gravida sed consectetur ut, interdum quis nisi. Quisque
          egestas nisl id lectus facilisis scelerisque.
        </p>
      </div>
      <div class="prose prose-indigo">
        <h4 class="font-bold text-lg mb-2">
          Do I get access to the community?
        </h4>
        <p class="text-gray-600">
          Etiam egestas fringilla enim, id convallis lectus laoreet at. Fusce
          purus nisi, gravida sed consectetur ut, interdum quis nisi. Quisque
          egestas nisl id lectus facilisis scelerisque.
        </p>
      </div>
      <div class="prose prose-indigo">
        <h4 class="font-bold text-lg mb-2">Do you offer email support?</h4>
        <p class="text-gray-600">
          Etiam egestas fringilla enim, id convallis lectus laoreet at. Fusce
          purus nisi, gravida sed consectetur ut, interdum quis nisi. Quisque
          egestas nisl id lectus facilisis scelerisque.
        </p>
      </div>
      <div class="prose prose-indigo">
        <h4 class="font-bold text-lg mb-2">Are the updates free for life?</h4>
        <p class="text-gray-600">
          Etiam egestas fringilla enim, id convallis lectus laoreet at. Fusce
          purus nisi, gravida sed consectetur ut, interdum quis nisi. Quisque
          egestas nisl id lectus facilisis scelerisque.
        </p>
      </div>
    </div>
    <!-- END FAQ -->
  </div>
</div>
<!-- END FAQ Section: To The Side -->

<!-- Contact Section: With Image Cover Brand -->
<div
  class="bg-cover"
  style="background-image: url('https://storea4wdr1.blob.core.windows.net/billboard-lg/9dd5501f-244e-4912-ab24-83672d46bcf2');"
>
  <div class="bg-brand-700/90">
    <div class="container xl:max-w-7xl mx-auto px-4 py-16 lg:px-8 lg:py-32">
      <div
        class="flex flex-col lg:flex-row lg:items-center space-y-16 lg:space-y-0 lg:space-x-16"
      >
        <!-- Heading with Company Info -->
        <div class="lg:w-2/5 text-white">
          <div
            class="text-sm uppercase font-bold tracking-wider mb-1 text-brand-400"
          >
            Any questions
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">Get in touch</h2>
          <h3 class="text-lg md:text-xl md:leading-relaxed text-white/60">
            If you need any further info, feel free to get in touch and we will
            get back to your as soon as possible.
          </h3>
          <div class="text-white mt-10">
            <h4 class="uppercase font-semibold tracking-wider mb-4">
              Australia 4WD Rentals
            </h4>
            <div class="leading-relaxed text-white/60">
              GPO Box 3410, Darwin, NT 0801.
            </div>
            <div class="leading-relaxed text-white/75 mt-4">
              Free Call Within Australia 1-800-107371<br />
              International Call +61 (0) 8 7999 7511
            </div>
          </div>
        </div>
        <!-- END Heading with Company Info -->

        <!-- Contact Form -->
        <div class="lg:w-3/5 p-2 bg-white bg-opacity-10 rounded-xl">
          <form
            onsubmit="return false;"
            class="bg-white rounded-lg p-6 space-y-6"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div class="space-y-1">
                <TextInput labelText="First Name" />
              </div>
              <div class="space-y-1">
                <TextInput labelText="Last Name" />
              </div>
            </div>
            <div class="space-y-1">
              <TextInput labelText="Email" />
            </div>
            <div class="space-y-1">
              <TextArea labelText="Message" />
            </div>
            <Button>Send Message</Button>
          </form>
        </div>
        <!-- END Contact Form -->
      </div>
    </div>
  </div>
</div>
<!-- END Contact Section: With Image Cover Brand -->

<!-- Footer Section: With Links Info Newsletter Dark -->
<footer id="page-footer" class="bg-gray-900">
  <div class="container xl:max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div class="space-y-6">
        <h4
          class="text-sm uppercase font-semibold tracking-wider text-gray-500"
        >
          Book now
        </h4>
        <nav class="flex flex-col space-y-3">
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            4WD/Motorhomes
          </a>
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            Accommodations
          </a>
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            Tours
          </a>
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            Yachts
          </a>
        </nav>
      </div>
      <div class="space-y-6">
        <h4
          class="text-sm uppercase font-semibold tracking-wider text-gray-500"
        >
          Company
        </h4>
        <nav class="flex flex-col space-y-3">
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            About Us
          </a>
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            Contact Us
          </a>
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            Terms of Service
          </a>
          <a href="/" class="font-medium text-gray-300 hover:text-gray-400">
            Privacy Policy
          </a>
        </nav>
      </div>
      <div class="space-y-6">
        <h4
          class="text-sm uppercase font-semibold tracking-wider text-gray-500"
        >
          Join Our Newsletter
        </h4>
        <form
          onsubmit="return false;"
          class="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:space-x-2"
        >
          <TextInput placeholder="Your email" />
          <Button>Subscribe</Button>
        </form>
      </div>
    </div>
    <hr class="my-10 opacity-10" />
    <div
      class="flex flex-col md:flex-row-reverse md:justify-between space-y-6 md:space-y-0 text-center md:text-left text-sm"
    >
      <nav class="space-x-4">
        <a
          href="https://www.facebook.com/Australia4wdrentals"
          class="text-gray-400 hover:text-brand-400 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            class="w-5 h-5 mr-2"
            fill="currentColor"
            ><path fill="none" d="M0 0h24v24H0z" /><path
              d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
            /></svg
          >
          Australia4wdrentals
        </a>
      </nav>
      <div class="text-gray-400">
        <span class="font-medium">&copy; 2023 Australia 4WD Rentals</span>
      </div>
    </div>
  </div>
</footer>
<!-- END Footer Section: With Links Info Newsletter Dark -->
