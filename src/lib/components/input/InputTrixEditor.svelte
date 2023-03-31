<script>
  export let field = {};
  export let record = {};
  import { browser } from "$app/environment";

  let ready = false;

  setTimeout(() => {
    ready = true;
  }, 500);

  import "$lib/css/trixeditor.css";
  import { TextArea } from "carbon-components-svelte";
</script>

<svelte:head>
  <link
    rel="stylesheet"
    type="text/css"
    href="https://unpkg.com/trix@2.0.0/dist/trix.css"
  />
  <script
    type="text/javascript"
    src="https://unpkg.com/trix@2.0.0/dist/trix.umd.min.js"
  ></script>

  <script>
    Trix.config.blockAttributes.heading2 = {
      tagName: "h2",
      terminal: true,
      breakOnReturn: true,
      group: false,
    };

    Trix.config.toolbar.getDefaultHTML = function () {
      return `
          <div class="trixtoolbar">
            <div>
              <button type="button" data-trix-attribute="bold" data-trix-key="b" title="Bold" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"/></svg></button>
              <button type="button" data-trix-attribute="italic" data-trix-key="i" title="Italic" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z"/></svg></button>
              <button type="button" data-trix-attribute="strike" title="Strikethrough" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z"/></svg></button>
            </div>
            <div>
              <button type="button" data-trix-attribute="heading1" title="Heading 1" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M13 20h-2v-7H4v7H2V4h2v7h7V4h2v16zm8-12v12h-2v-9.796l-2 .536V8.67L19.5 8H21z"/></svg></button>
              <button type="button" data-trix-attribute="heading2" title="Heading 2" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0H24V24H0z"/><path d="M4 4v7h7V4h2v16h-2v-7H4v7H2V4h2zm14.5 4c2.071 0 3.75 1.679 3.75 3.75 0 .857-.288 1.648-.772 2.28l-.148.18L18.034 18H22v2h-7v-1.556l4.82-5.546c.268-.307.43-.709.43-1.148 0-.966-.784-1.75-1.75-1.75-.918 0-1.671.707-1.744 1.606l-.006.144h-2C14.75 9.679 16.429 8 18.5 8z"/></svg></button>
            </div>
            <div>
              <button type="button" data-trix-attribute="bullet" title="Bullet List" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/></svg></button>
              <button type="button" data-trix-attribute="number" title="Number List" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zM3 14v-2.5h2V11H3v-1h3v2.5H4v.5h2v1H3zm2 5.5H3v-1h2V18H3v-1h3v4H3v-1h2v-.5zM8 11h13v2H8v-2zm0 7h13v2H8v-2z"/></svg></button>
            </div>
            <div>
              <button type="button" data-trix-action="increaseNestingLevel" title="Indent" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm0 15h18v2H3v-2zm8-5h10v2H11v-2zm0-5h10v2H11V9zm-4 3.5L3 16V9l4 3.5z"/></svg></button>
              <button type="button" data-trix-action="decreaseNestingLevel" title="Outdent" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M3 4h18v2H3V4zm0 15h18v2H3v-2zm8-5h10v2H11v-2zm0-5h10v2H11V9zm-8 3.5L7 9v7l-4-3.5z"/></svg></button>
            </div>
            <div>
              <button type="button" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="Link" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M18.364 15.536L16.95 14.12l1.414-1.414a5 5 0 1 0-7.071-7.071L9.879 7.05 8.464 5.636 9.88 4.222a7 7 0 0 1 9.9 9.9l-1.415 1.414zm-2.828 2.828l-1.415 1.414a7 7 0 0 1-9.9-9.9l1.415-1.414L7.05 9.88l-1.414 1.414a5 5 0 1 0 7.071 7.071l1.414-1.414 1.415 1.414zm-.708-10.607l1.415 1.415-7.071 7.07-1.415-1.414 7.071-7.07z"/></svg></button>
            </div>
          </div>
          <div class="trix-dialogs" data-trix-dialogs>
            <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
              <div class="trix-dialog__link-fields">
                <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="Link URL" aria-label="Link URL" required data-trix-input>
                <div class="trix-button-group">
                  <input type="button" class="trix-button trix-button--dialog" value="Link" data-trix-method="setAttribute">
                  <input type="button" class="trix-button trix-button--dialog" value="Unlink" data-trix-method="removeAttribute">
                </div>
              </div>
            </div>
          </div> 
      `;
    };
    // <button type="button" data-trix-action="attachFiles" title="Attach File" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"/></svg></button>

    // addEventListener("trix-attachment-add", function (event) {
    //   if (event.attachment.file) {
    //     console.log(event.attachment.file);
    //     // uploadFileAttachment(event.attachment)
    //   }
    // });
    // let element = document.querySelector("trix-editor")
    // element.editor
  </script>
</svelte:head>

<div class="text-sm font-bold text-gray-600 tracking-wide mb-2">
  {field.label}
</div>
<div class="content">
  <input type="hidden" id="x" value={record[field.name]} />
  {#if ready}
    <trix-editor
      input="x"
      on:blur={(e) => {
        console.log(e.target.innerHTML);
        record[field.name] = e.target.innerHTML;
      }}
    />
  {/if}
</div>
