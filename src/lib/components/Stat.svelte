<script>
    export let link = "/";
    export let value = 0;
    export let label = "";
    export let icon = "";
    export let note = "";
</script>

<a
    href={link}
    class="flex flex-col rounded border bg-white hover:border-gray-300 active:border-brand-300"
>
    <div class="p-5 lg:p-6 grow w-full flex justify-between items-center">
        <dl>
            <dt class="text-2xl font-bold">
                {value}
            </dt>
            <dd class="text-gray-600">
                {label}
            </dd>
        </dl>
        <div
            class="flex justify-center items-center rounded w-12 h-12 bg-brand-50 text-brand-600"
        >
            {@html icon}
        </div>
    </div>
    <div
        class="py-3 px-5 lg:px-6 w-full text-xs font-medium text-gray-500 border-t border-gray-200"
    >
        {note}
    </div>
</a>
