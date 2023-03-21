<script>
  import {
    Button,
    OverflowMenu,
    OverflowMenuItem,
  } from "carbon-components-svelte";
  // import Carousel from "svelte-carousel";
  // import { browser } from "$app/environment";
  // let carousel; // for calling methods of the carousel instance

  export let data;

  const getContent = (contentType) => {
    let resp = data.contents.filter(function (item) {
      return item.type === contentType;
    });
    return resp;
  };
</script>

<section
  id="topbar"
  class="bg-gray-800 text-white p-2 text-sm lg:flex items-center"
>
  <div class="flex-1 h-8 overflow-hidden hidden lg:block">
    {#each getContent("announcements") as announcement}
      <div class="h-8 leading-8">{announcement.name}</div>
    {/each}
  </div>
  <!-- <div class="flex-1 h-8 leading-8">
    Book your next 2023 rental for only $100 deposit. No booking fees!
  </div> -->
  <div class="py-1 px-2 bg-white/20 inline-block rounded">
    Free Call Within Australia 1-800-107371
  </div>
</section>
<header id="header" class="flex justify-between p-5">
  <div>
    <a href="/">
      <img src="/logo.svg" alt="Australia 4WD Rentals" class="w-36" />
    </a>
  </div>
  <div class="hidden md:flex">
    <div class="flex mr-4">
      <Button kind="ghost">About</Button>
      <Button kind="ghost">Blog</Button>
      <Button kind="ghost">Contact</Button>
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
      <OverflowMenuItem text="About" />
      <OverflowMenuItem text="Blog" />
      <OverflowMenuItem text="Contact" />
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
