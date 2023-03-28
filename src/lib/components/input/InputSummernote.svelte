<script>
  import "$lib/css/quill.css";
  //   import * as Quill from '$lib/js/quill.js'
  import { onMount } from "svelte";

  let editor;

  onMount(async () => {
    const { default: Quill } = await import("$lib/js/quill.js");

    let quill = new Quill(editor);
  });
</script>
<div bind:this={editor} />
