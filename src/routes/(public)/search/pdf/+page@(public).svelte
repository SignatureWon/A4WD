<script>
  import { html } from "$lib/provisional.js";
  import { onMount } from "svelte";

  let email = ""
  onMount(async () => {
    email = await html.create(163, "template_quote")
  })
  // import QuotePage1 from "$lib/components/QuotePage1.svelte";

  // import jsPDF from "jspdf";
  // function getPDF() {
  //   var doc = new jsPDF();
  //   doc.html(document.getElementById("quote_pdf"), {
  //     callback: function (doc) {
  //       doc.save("Generated.pdf");
  //     },
  //     x: 15,
  //     y: 15,
  //     width: 180, //target width in the PDF document
  //     windowWidth: 650, //window width in CSS pixels
  //   });

    // We'll make our own renderer to skip this editor
    // var specialElementHandlers = {
    //   "#getPDF": function (element, renderer) {
    //     return true;
    //   },
    //   ".controls": function (element, renderer) {
    //     return true;
    //   },
    // };

    // var source = document.getElementById("pdf").innerHTML

    // // All units are in the set measurement for the document
    // // This can be changed to "pt" (points), "mm" (Default), "cm", "in"
    // doc.fromHTML(
    //     source, 15, 15, {
    //   width: 170,
    //   elementHandlers: specialElementHandlers,
    // });

    // doc.save("Generated.pdf");
  // }

  // let email = ""
  // const genEmail = async () => {
  //   let result = await html.create(13, "template_quote")
  //   console.log(result);
  //   email = result
  // }

</script>

{@html email}

<!-- <QuotePage1 id={3} type="template_quote" /> -->
<!-- <button
  on:click={async () => {
    console.log(await pdf.create(12, "template_quote"));
  }}>DOWNLOAD</button
> -->

<!-- <button
  on:click={genEmail}>DOWNLOAD</button
>
 -->
<!-- <div>
  <button type="button" on:click={getPDF}>PDF</button>
</div> -->
<!-- 
<div class="p-10 bg-white" id="pdf">
  <div class="flex justify-between mb-5">
    <div>
      <div class="font-bold">Australia 4 Wheel Drive Rentals</div>
      <div>ABN No: 54 561 356 425 | License No: 094</div>
      <div>ABN No: 54 561 356 425 | License No: 094</div>
      <div>ABN No: 54 561 356 425 | License No: 094</div>
      <div>ABN No: 54 561 356 425 | License No: 094</div>
    </div>
    <div class="font-bold text-2xl">Quotation</div>
  </div>
  <div class="bg-gray-100 py-2 px-4 mb-5">
    If you have just entered a self quote request, please allow us 24 hours or
    less to check availability and price.
  </div>
  <div class="grid grid-cols-3">
    <div>
      <div class="text-gray-400 font-bold text-sm">Reference</div>
      <div>388001</div>
    </div>
    <div>
      <div class="text-gray-400 font-bold text-sm">Reference</div>
      <div>388001</div>
    </div>
    <div>
      <div class="text-gray-400 font-bold text-sm">Reference</div>
      <div>388001</div>
    </div>
  </div>
</div>

<button type="button" on:click={getPDF}>PDF</button> -->
