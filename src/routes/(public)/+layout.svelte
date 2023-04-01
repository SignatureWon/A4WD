<script>
  import {
    Button,
    OverflowMenu,
    OverflowMenuItem,
    TextArea,
    TextInput,
  } from "carbon-components-svelte";
  import { env } from "$env/dynamic/public";
  import Announcements from "$lib/components/public/Announcements.svelte";
  // import Carousel from "svelte-carousel";
  // import { browser } from "$app/environment";
  // let carousel; // for calling methods of the carousel instance

  export let data;

  // console.log(data);

  const getContent = (contentType) => {
    let resp = data.contents.filter(function (item) {
      return item.type === contentType;
    });
    return resp;
  };
</script>

<svelte:head>
  <title>{data.site.title}</title>
  <meta name="description" content={data.site.description} />
  <meta name="keywords" content={data.site.keywords} />
  <link
    rel="icon"
    href={`${env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/${data.site.icon}`}
  />
</svelte:head>

<section
  id="topbar"
  class="bg-gray-800 text-white p-2 text-sm lg:flex items-center"
>
  <div class="flex-1 h-8 overflow-hidden hidden lg:block">
    <Announcements records={getContent("announcements")} />
    <!-- {#each getContent("announcements") as announcement}
      <div class="h-8 leading-8">{announcement.name}</div>
    {/each} -->
  </div>
  <!-- <div class="flex-1 h-8 leading-8">
    Book your next 2023 rental for only $100 deposit. No booking fees!
  </div> -->
  <div class="py-1 px-2 bg-white/20 inline-block rounded">
    {data.site.hotline}
  </div>
</section>
<header id="header" class="flex justify-between p-5">
  <div>
    <a href="/">
      <img
        src="{env.PUBLIC_SUPABASE_URL}/storage/v1/object/public/contents/{data
          .site.logo}"
        alt={data.site.title}
        class="w-36"
      />
    </a>
  </div>
  <div class="hidden md:flex">
    <div class="flex mr-4">
      {#each getContent("pages") as page}
        {#if page.featured}
          <Button kind="ghost" href="/{page.slug}">{page.name}</Button>
        {/if}
      {/each}
      <Button kind="ghost" href="/blog">Blog</Button>
    </div>
    <Button><a href="/login">Sign In</a></Button>
  </div>
  <div class="flex md:hidden">
    <OverflowMenu flipped>
      <div slot="menu">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          class="w-5 h-5"
        >
          <path fill="none" d="M0 0h24v24H0z" /><path
            d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"
          />
        </svg>
      </div>
      {#each getContent("pages") as page}
        {#if page.featured}
          <OverflowMenuItem text={page.name} href="/{page.slug}" />
        {/if}
      {/each}
      <OverflowMenuItem text="Blog" href="/blog" />
    </OverflowMenu>
    <OverflowMenu flipped>
      <div slot="menu">
        <svg
          class="w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" /><path
            fill-rule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
          />
        </svg>
      </div>
      <OverflowMenuItem text="Sign In" />
    </OverflowMenu>
  </div>
</header>
<slot />
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
            {data.site.contact.name}
          </div>
          <h2 class="text-3xl md:text-4xl font-extrabold mb-4">
            {data.site.contact.subtitle}
          </h2>
          <div class="text-white/60">
            {@html data.site.contact.description}
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
              <TextInput labelText="Phone" />
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

<footer id="page-footer" class="bg-gray-900">
  <div class="container xl:max-w-7xl mx-auto px-4 py-16">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div class="space-y-6">
        <h4
          class="text-sm uppercase font-semibold tracking-wider text-gray-500"
        >
          Company
        </h4>
        <nav class="flex flex-col space-y-3">
          {#each getContent("pages") as page}
            {#if page.categories}
              {#if page.categories.name === "Company"}
                <a
                  href="/{page.slug}"
                  class="font-medium text-gray-300 hover:text-gray-400"
                >
                  {page.name}
                </a>
              {/if}
            {/if}
          {/each}
        </nav>
      </div>
      <div class="space-y-6">
        <h4
          class="text-sm uppercase font-semibold tracking-wider text-gray-500"
        >
          Product
        </h4>
        <nav class="flex flex-col space-y-3">
          {#each getContent("pages") as page}
            {#if page.categories}
              {#if page.categories.name === "Product"}
                <a
                  href="/{page.slug}"
                  class="font-medium text-gray-300 hover:text-gray-400"
                >
                  {page.name}
                </a>
              {/if}
            {/if}
          {/each}
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
        <span class="font-medium"
          >&copy; {new Date().getFullYear()} {data.site.title}</span
        >
      </div>
    </div>
  </div>
</footer>
