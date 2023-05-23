<script>
    export let active = "home";
    const modules = [
        {
            key: "home",
            name: "Home",
            link: "/admin",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.388a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zM6 19h12V9.157l-6-5.454-6 5.454V19z"/></svg>`,
        },
        {
            key: "sales",
            name: "Sales",
            link: "/admin/sales/manual_quotations",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm4.5 9H14a.5.5 0 1 0 0-1h-4a2.5 2.5 0 1 1 0-5h1V6h2v2h2.5v2H10a.5.5 0 1 0 0 1h4a2.5 2.5 0 1 1 0 5h-1v2h-2v-2H8.5v-2z"/></svg>`,
        },
        {
            key: "vehicles",
            name: "Vehicles",
            link: "/admin/vehicles",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 20H5v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V11l2.48-5.788A2 2 0 0 1 6.32 4H17.68a2 2 0 0 1 1.838 1.212L22 11v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1zm1-7H4v5h16v-5zM4.176 11h15.648l-2.143-5H6.32l-2.143 5zM6.5 17a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>`,
        },
        // {
        //     key: "services",
        //     name: "Services",
        //     link: "/admin/services",
        //     icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M6.75 2.5A4.25 4.25 0 0 1 11 6.75V11H6.75a4.25 4.25 0 1 1 0-8.5zM9 9V6.75A2.25 2.25 0 1 0 6.75 9H9zm-2.25 4H11v4.25A4.25 4.25 0 1 1 6.75 13zm0 2A2.25 2.25 0 1 0 9 17.25V15H6.75zm10.5-12.5a4.25 4.25 0 1 1 0 8.5H13V6.75a4.25 4.25 0 0 1 4.25-4.25zm0 6.5A2.25 2.25 0 1 0 15 6.75V9h2.25zM13 13h4.25A4.25 4.25 0 1 1 13 17.25V13zm2 2v2.25A2.25 2.25 0 1 0 17.25 15H15z"/></svg>`,
        // },
        {
            key: "contents",
            name: "Contents",
            link: "/admin/contents",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M20 22H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1zm-1-2V4H5v16h14zM7 6h4v4H7V6zm0 6h10v2H7v-2zm0 4h10v2H7v-2zm6-9h4v2h-4V7z"/></svg>`,
        },
        {
            key: "users",
            name: "Users",
            link: "/admin/users",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/></svg>`,
        },
        {
            key: "templates",
            name: "Templates",
            link: "/admin/templates",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5" fill="currentColor"><path d="M12.5065 3.62344L11.4835 5.39519C8.57378 4.51647 5.96968 4.9455 5.07207 6.50019C3.89477 8.53934 5.86239 12.1526 9.75027 14.3973C13.6382 16.642 17.7512 16.5393 18.9285 14.5002C19.8261 12.9455 18.8956 10.4758 16.6797 8.39519L17.7026 6.62344C20.7847 9.33215 22.1654 12.8936 20.6605 15.5002C18.8003 18.7223 13.4717 18.8552 8.75027 16.1294C4.0289 13.4035 1.47976 8.72227 3.34002 5.50019C4.84492 2.89362 8.61964 2.30867 12.5065 3.62344ZM15.8842 1.77295L17.6163 2.77295L12.6163 11.4332L10.8842 10.4332L15.8842 1.77295ZM6.73233 20.0002H17.0003V22.0002H5.01761C4.94008 22.0016 4.86194 21.994 4.78481 21.977C4.77025 21.9737 4.7558 21.9702 4.74147 21.9664C4.6589 21.9442 4.57784 21.911 4.50028 21.8662C4.47106 21.8493 4.44301 21.8312 4.41616 21.812C4.30161 21.7294 4.20524 21.6232 4.1342 21.5004C4.06328 21.3774 4.01939 21.2406 4.00518 21.0999C4.00446 21.0926 4.00381 21.0852 4.00325 21.0779C3.98786 20.8832 4.02924 20.6821 4.13425 20.5002L6.38425 16.6031L8.1163 17.6031L6.73233 20.0002Z"></path></svg>`,
        },
    ];
    const systems = [
        {
            key: "settings",
            name: "Settings",
            link: "/admin/settings",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 1l9.5 5.5v11L12 23l-9.5-5.5v-11L12 1zm0 2.311L4.5 7.653v8.694l7.5 4.342 7.5-4.342V7.653L12 3.311zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>`,
        },
        {
            key: "logout",
            name: "Logout",
            link: "/admin/logout",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M4 18h2v2h12V4H6v2H4V3a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3zm2-7h7v2H6v3l-5-4 5-4v3z"/></svg>`,
        },
    ];
</script>

<div
    class="flex w-14 flex-col bg-gray-900 text-gray-200 h-screen overflow-y-auto pb-12"
>
    <nav class="grow px-2 py-4">
        {#each modules as module}
            <a
                href={module.link}
                title={module.name}
                class={`w-full h-10 mb-2 flex items-center justify-center rounded hover:text-gray-100 hover:bg-gray-700 active:bg-opacity-50 ${
                    active === module.key
                        ? "bg-gray-700 text-white"
                        : "text-gray-500"
                }`}
            >
                {@html module.icon}
            </a>
        {/each}
    </nav>

    <nav class="flex-none px-2 py-4">
        {#each systems as system}
            <a
                href={system.link}
                title={system.name}
                class={`w-full h-10 mb-2 flex items-center justify-center rounded hover:text-gray-100 hover:bg-gray-700 active:bg-opacity-50 ${
                    active === system.key
                        ? "bg-gray-700 text-white"
                        : "text-gray-500"
                }`}
            >
                {@html system.icon}
            </a>
        {/each}
    </nav>
</div>
