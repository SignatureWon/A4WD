<script>
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import Link from "@tiptap/extension-link";
  import StarterKit from "@tiptap/starter-kit";
  import Table from "@tiptap/extension-table";
  import TableCell from "@tiptap/extension-table-cell";
  import TableHeader from "@tiptap/extension-table-header";
  import TableRow from "@tiptap/extension-table-row";

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
    // table: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M13 10V14H19V10H13ZM11 10H5V14H11V10ZM13 19H19V16H13V19ZM11 19V16H5V19H11ZM13 5V8H19V5H13ZM11 5H5V8H11V5ZM4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3Z"></path></svg>`,
    // col_before: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H14C13.4477 21 13 20.5523 13 20V4C13 3.44772 13.4477 3 14 3H20ZM19 5H15V19H19V5ZM6 7C8.76142 7 11 9.23858 11 12C11 14.7614 8.76142 17 6 17C3.23858 17 1 14.7614 1 12C1 9.23858 3.23858 7 6 7ZM7 9H5V10.999L3 11V13L5 12.999V15H7V12.999L9 13V11L7 10.999V9Z"></path></svg>`,
    // col_after: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M10 3C10.5523 3 11 3.44772 11 4V20C11 20.5523 10.5523 21 10 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H10ZM9 5H5V19H9V5ZM18 7C20.7614 7 23 9.23858 23 12C23 14.7614 20.7614 17 18 17C15.2386 17 13 14.7614 13 12C13 9.23858 15.2386 7 18 7ZM19 9H17V10.999L15 11V13L17 12.999V15H19V12.999L21 13V11L19 10.999V9Z"></path></svg>`,
    // row_before: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M20 13C20.5523 13 21 13.4477 21 14V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V14C3 13.4477 3.44772 13 4 13H20ZM19 15H5V19H19V15ZM12 1C14.7614 1 17 3.23858 17 6C17 8.76142 14.7614 11 12 11C9.23858 11 7 8.76142 7 6C7 3.23858 9.23858 1 12 1ZM13 3H11V4.999L9 5V7L11 6.999V9H13V6.999L15 7V5L13 4.999V3Z"></path></svg>`,
    // row_after: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M12 13C14.7614 13 17 15.2386 17 18C17 20.7614 14.7614 23 12 23C9.23858 23 7 20.7614 7 18C7 15.2386 9.23858 13 12 13ZM13 15H11V16.999L9 17V19L11 18.999V21H13V18.999L15 19V17L13 16.999V15ZM20 3C20.5523 3 21 3.44772 21 4V10C21 10.5523 20.5523 11 20 11H4C3.44772 11 3 10.5523 3 10V4C3 3.44772 3.44772 3 4 3H20ZM5 5V9H19V5H5Z"></path></svg>`,
    // col_delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M12 3C12.5523 3 13 3.44772 13 4L12.9998 11.9998C13.8355 11.372 14.8743 11 16 11C18.7614 11 21 13.2386 21 16C21 18.7614 18.7614 21 16 21C14.9681 21 14.0092 20.6874 13.2129 20.1518L13 20C13 20.5523 12.5523 21 12 21H6C5.44772 21 5 20.5523 5 20V4C5 3.44772 5.44772 3 6 3H12ZM11 5H7V19H11V5ZM19 15H13V17H19V15Z"></path></svg>`,
    // row_delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M20 5C20.5523 5 21 5.44772 21 6V12C21 12.5523 20.5523 13 20 13C20.628 13.8355 21 14.8743 21 16C21 18.7614 18.7614 21 16 21C13.2386 21 11 18.7614 11 16C11 14.8743 11.372 13.8355 11.9998 12.9998L4 13C3.44772 13 3 12.5523 3 12V6C3 5.44772 3.44772 5 4 5H20ZM13 15V17H19V15H13ZM19 7H5V11H19V7Z"></path></svg>`,
    // cell_merge: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V10.999H7V9L10 12L7 15V13H5V19H11V17H13V19H19V13H17V15L14 12L17 9V10.999H19V5H13V7H11V5ZM13 13V15H11V13H13ZM13 9V11H11V9H13Z"></path></svg>`,
    // cell_split: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20ZM11 5H5V19H11V15H13V19H19V5H13V9H11V5ZM15 9L18 12L15 15V13H9V15L6 12L9 9V11H15V9Z"></path></svg>`,
    table: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z" /></svg>`,
    table_delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M15.46,15.88L16.88,14.46L19,16.59L21.12,14.46L22.54,15.88L20.41,18L22.54,20.12L21.12,21.54L19,19.41L16.88,21.54L15.46,20.12L17.59,18L15.46,15.88M4,3H18A2,2 0 0,1 20,5V12.08C18.45,11.82 16.92,12.18 15.68,13H12V17H13.08C12.97,17.68 12.97,18.35 13.08,19H4A2,2 0 0,1 2,17V5A2,2 0 0,1 4,3M4,7V11H10V7H4M12,7V11H18V7H12M4,13V17H10V13H4Z" /></svg>`,
    col_before: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M13,2A2,2 0 0,0 11,4V20A2,2 0 0,0 13,22H22V2H13M20,10V14H13V10H20M20,16V20H13V16H20M20,4V8H13V4H20M9,11H6V8H4V11H1V13H4V16H6V13H9V11Z" /></svg>`,
    col_after: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M11,2A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H2V2H11M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M15,11H18V8H20V11H23V13H20V16H18V13H15V11Z" /></svg>`,
    col_head: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M8,2H16A2,2 0 0,1 18,4V20A2,2 0 0,1 16,22H8A2,2 0 0,1 6,20V4A2,2 0 0,1 8,2M8,10V14H16V10H8M8,16V20H16V16H8M8,4V8H16V4H8Z" /></svg>`,
    col_delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M4,2H11A2,2 0 0,1 13,4V20A2,2 0 0,1 11,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2M4,10V14H11V10H4M4,16V20H11V16H4M4,4V8H11V4H4M17.59,12L15,9.41L16.41,8L19,10.59L21.59,8L23,9.41L20.41,12L23,14.59L21.59,16L19,13.41L16.41,16L15,14.59L17.59,12Z" /></svg>`,
    row_before: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M22,14A2,2 0 0,0 20,12H4A2,2 0 0,0 2,14V21H4V19H8V21H10V19H14V21H16V19H20V21H22V14M4,14H8V17H4V14M10,14H14V17H10V14M20,14V17H16V14H20M11,10H13V7H16V5H13V2H11V5H8V7H11V10Z" /></svg>`,
    row_after: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M22,10A2,2 0 0,1 20,12H4A2,2 0 0,1 2,10V3H4V5H8V3H10V5H14V3H16V5H20V3H22V10M4,10H8V7H4V10M10,10H14V7H10V10M20,10V7H16V10H20M11,14H13V17H16V19H13V22H11V19H8V17H11V14Z" /></svg>`,
    row_head: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M22,14A2,2 0 0,1 20,16H4A2,2 0 0,1 2,14V10A2,2 0 0,1 4,8H20A2,2 0 0,1 22,10V14M4,14H8V10H4V14M10,14H14V10H10V14M16,14H20V10H16V14Z" /></svg>`,
    row_delete: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M9.41,13L12,15.59L14.59,13L16,14.41L13.41,17L16,19.59L14.59,21L12,18.41L9.41,21L8,19.59L10.59,17L8,14.41L9.41,13M22,9A2,2 0 0,1 20,11H4A2,2 0 0,1 2,9V6A2,2 0 0,1 4,4H20A2,2 0 0,1 22,6V9M4,9H8V6H4V9M10,9H14V6H10V9M16,9H20V6H16V9Z" /></svg>`,
    cell_merge: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M5,10H3V4H11V6H5V10M19,18H13V20H21V14H19V18M5,18V14H3V20H11V18H5M21,4H13V6H19V10H21V4M8,13V15L11,12L8,9V11H3V13H8M16,11V9L13,12L16,15V13H21V11H16Z" /></svg>`,
    cell_split: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor"><path d="M19 14H21V20H3V14H5V18H19V14M3 4V10H5V6H19V10H21V4H3M11 11V13H8V15L5 12L8 9V11H11M16 11V9L19 12L16 15V13H13V11H16Z" /></svg>`,
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
        Table.configure({
          resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
      ],
      content: value,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
        value = editor.getHTML();
      },
      // onUpdate: () => {
      //     console.log("updated onUpdate");
      // },
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
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
  // $:value,  editor?.commands.setContent(value)

  // $: {
  //   editor.commands.setContent(value)
  // }
</script>

<div class="md:col-span-2">
  <div class="mb-2 text-sm tracking-wide text-gray-600 font-semibold">
    {label}
  </div>
  <div class="border border-gray-200">
    <div class="flex border-b border-gray-200 flex-wrap">
      {#if editor}
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleBold().run()}
            class="{editor.isActive('bold') ? 'bg-gray-100' : ''} p-2"
            title="Bold"
          >
            {@html icon.bold}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleItalic().run()}
            class="{editor.isActive('italic') ? 'bg-gray-100' : ''} p-2"
            title="Italic"
          >
            {@html icon.italic}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleStrike().run()}
            class="{editor.isActive('strike') ? 'bg-gray-100' : ''} p-2"
            title="Strike"
          >
            {@html icon.strike}
          </button>
        </div>
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            class="{editor.isActive('heading', { level: 1 }) ? 'bg-gray-100' : ''} p-2"
            title="Heading 1"
          >
            {@html icon.h1}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            class="{editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''} p-2"
            title="Heading 2"
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
            title="Bullet list"
          >
            {@html icon.ul}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleOrderedList().run()}
            class="{editor.isActive('orderedList') ? 'bg-gray-100' : ''} p-2"
            title="Ordered list"
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
            title="Insert link"
          >
            {@html icon.link}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().unsetLink().run()}
            class="p-2"
            title="Remove link"
          >
            {@html icon.unlink}
          </button>
        </div>
        <div class="border-r border-b border-gray-200 flex">
          <button
            type="button"
            on:click={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            class="p-2"
            title="Insert table"
          >
            {@html icon.table}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().addColumnBefore().run()}
            disabled={!editor.can().addColumnBefore()}
            class="{editor.can().addColumnBefore() ? '' : 'text-gray-300'} p-2"
            title="Add column before"
          >
            {@html icon.col_before}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.can().addColumnAfter()}
            class="{editor.can().addColumnAfter() ? '' : 'text-gray-300'} p-2"
            title="Add column after"
          >
            {@html icon.col_after}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.can().deleteColumn()}
            class="{editor.can().deleteColumn() ? '' : 'text-gray-300'} p-2"
            title="Delete column"
          >
            {@html icon.col_delete}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().addRowBefore().run()}
            disabled={!editor.can().addRowBefore()}
            class="{editor.can().addRowBefore() ? '' : 'text-gray-300'} p-2"
            title="Add row before"
          >
            {@html icon.row_before}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.can().addRowAfter()}
            class="{editor.can().addRowAfter() ? '' : 'text-gray-300'} p-2"
            title="Add row after"
          >
            {@html icon.row_after}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.can().deleteRow()}
            class="{editor.can().deleteRow() ? '' : 'text-gray-300'} p-2"
            title="Delete row"
          >
            {@html icon.row_delete}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().deleteTable().run()}
            disabled={!editor.can().deleteTable()}
            class="{editor.can().deleteTable() ? '' : 'text-gray-300'} p-2"
            title="Delete table"
          >
            {@html icon.table_delete}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().mergeCells().run()}
            disabled={!editor.can().mergeCells()}
            class="{editor.can().mergeCells() ? '' : 'text-gray-300'} p-2"
            title="Merge cell"
          >
            {@html icon.cell_merge}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().splitCell().run()}
            disabled={!editor.can().splitCell()}
            class="{editor.can().splitCell() ? '' : 'text-gray-300'} p-2"
            title="Split cell"
          >
            {@html icon.cell_split}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleHeaderColumn().run()}
            disabled={!editor.can().toggleHeaderColumn()}
            class="{editor.can().toggleHeaderColumn() ? '' : 'text-gray-300'} p-2"
            title="Header column"
          >
            {@html icon.col_head}
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().toggleHeaderRow().run()}
            disabled={!editor.can().toggleHeaderRow()}
            class="{editor.can().toggleHeaderRow() ? '' : 'text-gray-300'} p-2"
            title="Header row"
          >
            {@html icon.row_head}
          </button>
          <!-- <button
            type="button"
            on:click={() => editor.chain().focus().toggleHeaderCell().run()}
            disabled={!editor.can().toggleHeaderCell()}
            class="{editor.can().toggleHeaderCell() ? '' : 'text-gray-300'} p-2"
          >
            toggleHeaderCell
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().mergeOrSplit().run()}
            disabled={!editor.can().mergeOrSplit()}
            class="{editor.can().mergeOrSplit() ? '' : 'text-gray-300'} p-2"
          >
            mergeOrSplit
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().setCellAttribute("backgroundColor", "#FAF594").run()}
            disabled={!editor.can().setCellAttribute("backgroundColor", "#FAF594")}
            class="{editor.can().action() ? '' : 'text-gray-300'} p-2"
          >
            setCellAttribute
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().fixTables().run()}
            disabled={!editor.can().fixTables()}
            class="{editor.can().fixTables() ? '' : 'text-gray-300'} p-2"
          >
            fixTables
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().goToNextCell().run()}
            disabled={!editor.can().goToNextCell()}
            class="{editor.can().goToNextCell() ? '' : 'text-gray-300'} p-2"
          >
            goToNextCell
          </button>
          <button
            type="button"
            on:click={() => editor.chain().focus().goToPreviousCell().run()}
            disabled={!editor.can().goToPreviousCell()}
            class="{editor.can().goToPreviousCell() ? '' : 'text-gray-300'} p-2"
          >
            goToPreviousCell
          </button> -->
        </div>
      {/if}
    </div>
    <div class="p-4 content">
      <div bind:this={element} class="[&>div]:min-h-[200px] focus-visible:[&>div]:outline-none" />
    </div>
  </div>
  <input type="hidden" {name} bind:value />
</div>
