<script>
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";

  export let name = "";
  export let label = "";
  export let value = "";

  const icon = {
    bold: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"/></svg>`,
    italic: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"/></svg>`,
    strike: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"/></svg>`,
    h1: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0H24V24H0z"/><path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z"/></svg>`,
    h2: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0H24V24H0z"/><path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"/></svg>`,
    // h3: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M22 8L21.9984 10L19.4934 12.883C21.0823 13.3184 22.25 14.7728 22.25 16.5C22.25 18.5711 20.5711 20.25 18.5 20.25C16.674 20.25 15.1528 18.9449 14.8184 17.2166L16.7821 16.8352C16.9384 17.6413 17.6481 18.25 18.5 18.25C19.4665 18.25 20.25 17.4665 20.25 16.5C20.25 15.5335 19.4665 14.75 18.5 14.75C18.214 14.75 17.944 14.8186 17.7056 14.9403L16.3992 13.3932L19.3484 10H15V8H22ZM4 4V11H11V4H13V20H11V13H4V20H2V4H4Z"></path></svg>`,
    // p: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M12 6V21H10V16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4H20V6H17V21H15V6H12ZM10 6C7.79086 6 6 7.79086 6 10C6 12.2091 7.79086 14 10 14V6Z"></path></svg>`,
    ul: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/></svg>`,
    ol: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/></svg>`,
    link: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M17.6572 14.8282L16.2429 13.414L17.6572 11.9998C19.2193 10.4377 19.2193 7.90506 17.6572 6.34296C16.0951 4.78086 13.5624 4.78086 12.0003 6.34296L10.5861 7.75717L9.17188 6.34296L10.5861 4.92875C12.9292 2.5856 16.7282 2.5856 19.0714 4.92875C21.4145 7.27189 21.4145 11.0709 19.0714 13.414L17.6572 14.8282ZM14.8287 17.6567L13.4145 19.0709C11.0714 21.414 7.27238 21.414 4.92923 19.0709C2.58609 16.7277 2.58609 12.9287 4.92923 10.5856L6.34345 9.17139L7.75766 10.5856L6.34345 11.9998C4.78135 13.5619 4.78135 16.0946 6.34345 17.6567C7.90555 19.2188 10.4382 19.2188 12.0003 17.6567L13.4145 16.2425L14.8287 17.6567ZM14.8287 7.75717L16.2429 9.17139L9.17188 16.2425L7.75766 14.8282L14.8287 7.75717Z"></path></svg>`,
    unlink: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M17.657 14.8286L16.2428 13.4143L17.657 12.0001C19.2191 10.438 19.2191 7.90538 17.657 6.34328C16.0949 4.78118 13.5622 4.78118 12.0001 6.34328L10.5859 7.75749L9.17171 6.34328L10.5859 4.92907C12.9291 2.58592 16.7281 2.58592 19.0712 4.92907C21.4143 7.27221 21.4143 11.0712 19.0712 13.4143L17.657 14.8286ZM14.8286 17.657L13.4143 19.0712C11.0712 21.4143 7.27221 21.4143 4.92907 19.0712C2.58592 16.7281 2.58592 12.9291 4.92907 10.5859L6.34328 9.17171L7.75749 10.5859L6.34328 12.0001C4.78118 13.5622 4.78118 16.0949 6.34328 17.657C7.90538 19.2191 10.438 19.2191 12.0001 17.657L13.4143 16.2428L14.8286 17.657ZM14.8286 7.75749L16.2428 9.17171L9.17171 16.2428L7.75749 14.8286L14.8286 7.75749ZM5.77539 2.29303L7.70724 1.77539L8.74252 5.63909L6.81067 6.15673L5.77539 2.29303ZM15.2578 18.3612L17.1896 17.8435L18.2249 21.7072L16.293 22.2249L15.2578 18.3612ZM2.29303 5.77539L6.15673 6.81067L5.63909 8.74252L1.77539 7.70724L2.29303 5.77539ZM18.3612 15.2578L22.2249 16.293L21.7072 18.2249L17.8435 17.1896L18.3612 15.2578Z"></path></svg>`,
  };

  let element;
  let editor;
  let setLink;

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
        }),
      ],
      content: value,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
        value = editor.getHTML();
      },
    //   onUpdate: () => {
    //     debounce(() => {
    //       console.log("updated onUpdate");
    //     });
    //   },
    });

    setLink = () => {
      const previousUrl = editor.getAttributes("link").href;
      const url = window.prompt("URL", previousUrl);

      // cancelled
      if (url === null) {
        return;
      }

      // empty
      if (url === "") {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();

        return;
      }

      // update link
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    };
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>

<div class="md:col-span-2">
  <div class="mb-2 text-sm tracking-wide text-gray-600 font-semibold">
    {label}
  </div>
  <div class="border border-gray-200">
    <div class="flex border-b border-gray-200">
      {#if editor}
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class="{editor.isActive('bold') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.bold}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleItalic().run()}
            class="{editor.isActive('italic') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.italic}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleStrike().run()}
            class="{editor.isActive('strike') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.strike}
          </button>
        </div>
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()}
            class="{editor.isActive('heading', { level: 1 })
              ? 'bg-gray-100'
              : ''} p-2"
          >
            {@html icon.h1}
          </button>
          <button
            type="button"
            on:click={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()}
            class="{editor.isActive('heading', { level: 2 })
              ? 'bg-gray-100'
              : ''} p-2"
          >
            {@html icon.h2}
          </button>
          <!-- <button
            type="button"
            on:click={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            class="{editor.isActive('heading', { level: 3 }) ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.h3}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().setParagraph().run()}
            class="{editor.isActive('setParagraph') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.p}
          </button> -->
        </div>
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBulletList().run()}
            class="{editor.isActive('bulletList') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.ul}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleOrderedList().run()}
            class="{editor.isActive('orderedList') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.ol}
          </button>
        </div>
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() => {
              setLink();
            }}
            class="{editor.isActive('link') ? 'bg-gray-100' : ''} p-2"
          >
            {@html icon.link}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().unsetLink().run()}
            class="p-2"
          >
            {@html icon.unlink}
          </button>
        </div>
      {/if}
    </div>
    <div class="p-4 content">
      <div
        bind:this={element}
        class="[&>div]:min-h-[200px] focus-visible:[&>div]:outline-none"
      />
    </div>
  </div>
  <input type="hidden" {name} bind:value />
</div>
