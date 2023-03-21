<script>
  export let show = false;
  export let message = "Message";
  export let status = "success";
  $: {
    if (show) {
      setTimeout(() => {
        show = false;
      }, 2000);
    }
  }
</script>

<div
  class={`fixed left-0 w-full transition-all z-[9999] ${show ? "top-1" : "-top-20"}`}
>
  <div
    class={`w-60 mx-auto py-2 px-4 text-white rounded text-center ${
      status === "success" ? "bg-green-600" : "bg-red-600"
    }`}
  >
    {message}
  </div>
</div>
