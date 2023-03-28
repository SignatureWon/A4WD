<script>
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  let editor, EditorJS;
  let uploader, ImageTool, Header, Alert, Table, List, RawTool;

  export let field = {};
  export let record = {};

  onMount(async () => {
    EditorJS = (await import("@editorjs/editorjs")).default;
    uploader = (await import("@ajite/editorjs-image-base64")).default;
    ImageTool = (await import("@editorjs/image")).default;
    Header = (await import("@editorjs/header")).default;
    Alert = (await import("editorjs-alert")).default;
    // Paragraph = (await import("@editorjs/paragraph")).default;
    Table = (await import("@editorjs/table")).default;
    // Embed = (await import("@editorjs/embed")).default;
    List = (await import("@editorjs/list")).default;
    RawTool = (await import("@editorjs/raw")).default;

    setTimeout(() => {
      editor = new EditorJS({
        data: record[field.name],
        autofocus: true,
        tools: {
          header: Header,
          image: {
            class: ImageTool,
            config: {
              uploader,
            },
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
            },
          },
          alert: Alert,
          raw: RawTool,
          // embed: {
          //   class: Embed,
          //   config: {
          //     services: {
          //       youtube: true,
          //     },
          //   },
          // },
          // paragraph: {
          //   class: Paragraph,
          //   inlineToolbar: true,
          // },
        },
        onChange: () => {
          editor.save().then((outputData) => {
            record[field.name] = outputData;
          });
        },
      });
    }, "500");

    // if (browser) {
    // let rec = await record[field.name];
    // console.log("rec", rec);

    // await record[field.name]
    // console.log(record[field.name]);
  });

  // $: {
  //   if (record[field.name]) {
  //     console.log("log", record[field.name]);
  //     if (browser) {
  //       editor.blocks.render({ blocks: record[field.name].blocks });

  //       // if (browser) {
  //       //   editor.render({blocks: record[field.name].blocks});
  //     }
  //   }
  // }

  // $: {
  //   if (record[field.name]) {
  //     console.log(record[field.name].blocks);
  //     if (browser) {
  //       editor.render({blocks: record[field.name].blocks});
  //     }
  //   }
  // }
</script>

<div class="text-sm font-bold text-gray-600 tracking-wide mb-2">
  {field.label}
</div>
<div class="border border-gray-200 px-10 py-2 content">
  <div id="editorjs" />
</div>
