<script>
  import { Button } from "carbon-components-svelte";

  export let field = {};
  export let record = {};
</script>

<div class="text-sm font-bold text-gray-600 tracking-wide mb-2">
  {field.label}
</div>
<div class="border border-gray-200">
  <div class="border-b border-gray-200 flex px-2">
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("bold", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
        /></svg
      >
    </Button>
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("italic", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"
        /></svg
      >
    </Button>
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("underline", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z"
        /></svg
      >
    </Button>
    <div class="border-r border-gray-200 h-10 mx-2" />
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("formatBlock", false, "<h1>")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0H24V24H0z" /><path
          d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z"
        /></svg
      >
    </Button>
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("formatBlock", false, "<h2>")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0H24V24H0z" /><path
          d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"
        /></svg
      >
    </Button>
    <div class="border-r border-gray-200 h-10 mx-2" />
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("insertOrderedList", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
        /></svg
      >
    </Button>
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("insertUnorderedList", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"
        /></svg
      >
    </Button>
    <div class="border-r border-gray-200 h-10 mx-2" />
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("indent", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M3 4h18v2H3V4zm0 15h18v2H3v-2zm8-5h10v2H11v-2zm0-5h10v2H11V9zm-4 3.5L3 16V9l4 3.5z"
        /></svg
      >
    </Button>
    <Button
      kind="ghost"
      class="px-2"
      on:click={() => document.execCommand("foreColor", false, null)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        class="w-4 h-4"
        fill="#555"
        ><path fill="none" d="M0 0h24v24H0z" /><path
          d="M3 4h18v2H3V4zm0 15h18v2H3v-2zm8-5h10v2H11v-2zm0-5h10v2H11V9zm-8 3.5L7 9v7l-4-3.5z"
        /></svg
      >
    </Button>
  </div>
  <div
    class="p-4 min-h-[400px] focus-visible: outline-brand-600 content"
    on:change={(e) => {
      record[field.name] = e.target.innerHTML;
    }}
    contenteditable="true"
    bind:innerHTML={record[field.name]}
    on:paste={(e) => {
      e.preventDefault();
      document.execCommand(
        "insertHTML",
        false,
        e.clipboardData.getData("text/plain")
      );
    }}
  />
</div>
