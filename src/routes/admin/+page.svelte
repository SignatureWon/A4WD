<script>
    import Stat from "$lib/components/Stat.svelte";
    const stats = [
        {
            label: "Bookings",
            value: "108",
            link: "/admin/sales/",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M17 16h2V4H9v2h8v10zm0 2v3c0 .552-.45 1-1.007 1H4.007A1.001 1.001 0 0 1 3 21l.003-14c0-.552.45-1 1.007-1H7V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3zM5.003 8L5 20h10V8H5.003zM7 16h4.5a.5.5 0 1 0 0-1h-3a2.5 2.5 0 1 1 0-5H9V9h2v1h2v2H8.5a.5.5 0 1 0 0 1h3a2.5 2.5 0 1 1 0 5H11v1H9v-1H7v-2z"/></svg>`,
            note: "In the last 30 days",
        },
        {
            label: "Sales",
            value: "$12,340",
            link: "/admin/sales",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0H24V24H0z"/><path d="M5 3v16h16v2H3V3h2zm15.293 3.293l1.414 1.414L16 13.414l-3-2.999-4.293 4.292-1.414-1.414L13 7.586l3 2.999 4.293-4.292z"/></svg>`,
            note: "In the last 30 days",
        },
        {
            label: "Customers",
            value: "1,023",
            link: "/admin/customers/",
            icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="w-5 h-5" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M14 14.252v2.09A6 6 0 0 0 6 22l-2-.001a8 8 0 0 1 10-7.748zM12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm5.793 8.914l3.535-3.535 1.415 1.414-4.95 4.95-3.536-3.536 1.415-1.414 2.12 2.121z"/></svg>`,
            note: "All active members",
        },
    ];
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
    {#each stats as stat}
        <Stat
            label={stat.label}
            value={stat.value}
            link={stat.link}
            icon={stat.icon}
            note={stat.note}
        />
    {/each}
</div>
