<script>
  export let data;
</script>

<div class="h-screen">
  <iframe
    src="https://drive.google.com/viewerng/viewer?embedded=true&url=https://api.australia4wdrentals.com/storage/v1/object/public/terms/{data
      .data.attachment}#toolbar=0&scrollbar=0"
    frameBorder="0"
    scrolling="auto"
    height="100%"
    width="100%"
    title={data.data.name}
  />
  <!-- <object
    data="https://api.australia4wdrentals.com/storage/v1/object/public/terms/{data.data.attachment}"
    type="application/pdf"
    width="100%"
    height="100%"
    title={data.data.name}
  >
    <p>
      Unable to display PDF file. <a
        href="https://api.australia4wdrentals.com/storage/v1/object/public/terms/{data.data.attachment}"
        >Download</a
      > instead.
    </p>
  </object> -->
</div>
