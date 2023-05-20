<script>
  import {
    Header,
    SideNav,
    SkipToContent,
    Content,
    OverflowMenu,
    OverflowMenuItem,
  } from "carbon-components-svelte";
  import UserAvatar from "carbon-icons-svelte/lib/UserAvatar.svelte";
  import { theme } from "$lib/theme.js";

  import { supabase } from "$lib/supabaseClient";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  export let data;
  console.log("data", data);

  let site = {};
  let c = {};

  onMount(async () => {
    const { data, error } = await supabase.auth.getSession();
    if (!data.session) {
      goto(`/login`);
    }
    const { data: constants } = await supabase
      .from("constants")
      .select("type, name, subtitle, description")
      .in("type", [
        "title",
        "description",
        "keywords",
        "hotline",
        "logo",
        "icon",
        "color",
        "contact",
      ]);

    constants.forEach((item) => {
      if (item.type === "contact") {
        site[item.type] = item;
      } else {
        site[item.type] = item.name;
      }
    });
    c = theme.brandcolor(site.color);
  });

  // console.log("data", data);

  //   if (!data.session) {
  //     goto(`/login`);
  //   }

  let isSideNavOpen = false;

  import LayoutAside from "$lib/components/admin/LayoutAside.svelte";
  import LayoutAsideContent from "$lib/components/admin/LayoutAsideContent.svelte";
  import Feedback from "$lib/components/admin/Feedback.svelte";

  import { page } from "$app/stores";
  let path = $page.url.pathname.split("/");
  let module = "home";
  let submodule = "";

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  $: {
    path = $page.url.pathname.split("/");
    module = path.length > 2 ? path[2] : "home";
    submodule = path.length > 3 ? path[3] : "";
  }
</script>

<svelte:head>
  <title>
    {capitalize(module)}
    {submodule === "" ? "" : ` - ${capitalize(submodule)}`}
  </title>
</svelte:head>
<div
  style="--brand50: {c.brand50}; --brand100: {c.brand100}; --brand200: {c.brand200}; --brand300: {c.brand300}; --brand400: {c.brand400}; --brand-color: {c.brand500}; --brand600: {c.brand600}; --brand700: {c.brand700}; --brand-color-hover: {c.brand800}; --brand900: {c.brand900};"
>
  <Feedback />
  <Header
    company="Australia 4WD Rentals"
    platformName=""
    bind:isSideNavOpen
    class="bg-gray-900 justify-between"
  >
    <svelte:fragment slot="skip-to-content">
      <SkipToContent />
    </svelte:fragment>
    <div class="flex flex-1">
      <div class="flex-1 text-white" />
      <div class="px-1">
        <OverflowMenu
          flipped
          class="rounded text-gray-400 !bg-transparent hover:text-white hover:bg-gray-700"
        >
          <div slot="menu"><UserAvatar size={20} /></div>
          <OverflowMenuItem text="Manage Profile" href="/admin/profile" />
          <OverflowMenuItem text="Log out" href="/admin/logout" />
        </OverflowMenu>
      </div>
    </div>
  </Header>

  <SideNav bind:isOpen={isSideNavOpen}>
    <div class="flex">
      <LayoutAside active={module} />
      <LayoutAsideContent {module} active={submodule} />
    </div>
  </SideNav>

  <Content>
    <slot />
  </Content>
</div>
