import dayjs from "dayjs";
export const rates = {
  name: {
    label: "Name",
    placeholder: "",
    type: "text",
    default: null,
    required: true,
    related: false,
    options: false,
    half: false,
  },
  nett: {
    label: "Nett Factor (Percentage)",
    placeholder: "",
    type: "number",
    default: null,
    required: false,
    related: false,
    options: 0.01,
    half: true,
  },
  gross: {
    label: "Gross Factor (Percentage)",
    placeholder: "",
    type: "number",
    default: null,
    required: false,
    related: false,
    options: 0.01,
    half: true,
  },
  date_start: {
    label: "Start date",
    placeholder: "",
    type: "daterange",
    default: dayjs(),
    required: false,
    related: false,
    options: false,
    half: false,
  },
  date_end: {
    label: "End date",
    placeholder: "",
    type: "daterange",
    default: dayjs(),
    required: false,
    related: false,
    options: false,
    half: false,
  },
  fees: {
    label: "Fees",
    placeholder: "",
    type: "seasonal",
    default: [],
    required: false,
    related: false,
    options: [],
    //   {
    //     key: "depot",
    //     label: "Depot",
    //     placeholder: "",
    //     type: "related",
    //     default: null,
    //     required: false,
    //     related: "suppliers",
    //     options: false,
    //     half: true,
    //   },
    //   {
    //     key: "vehicle",
    //     label: "Vehicle",
    //     placeholder: "",
    //     type: "related",
    //     default: null,
    //     required: false,
    //     related: "vehicles",
    //     options: false,
    //     half: true,
    //   },
    //   {
    //     key: "fee",
    //     label: "Daily Fee",
    //     placeholder: "",
    //     type: "number",
    //     default: null,
    //     required: false,
    //     related: false,
    //     options: false,
    //     half: false,
    //   },
    // ],
    half: false,
  },
  matrixTable: {
    label: "Matrix",
    placeholder: "",
    type: "json",
    default: [],
    required: false,
    related: false,
    options: [],
  },
  zero: {
    label: "Matrix starts from zero",
    placeholder: "",
    type: "switch",
    default: false,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  tiers: {
    label: "Tiered-rates",
    placeholder: "",
    type: "seasonal_tiers",
    default: [],
    required: false,
    related: false,
    options: false,
  },
  calendar: {
    label: "Calendar Day",
    placeholder: "",
    type: "switch",
    default: false,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  matrix: {
    label: "Matrix",
    placeholder: "",
    type: "text",
    default: null,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  data: {
    label: "Data",
    placeholder: "",
    type: "text",
    default: null,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  type: {
    label: "Type",
    placeholder: "",
    type: "hidden",
    default: null,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  suppliers: {
    label: "Supplier",
    placeholder: "",
    type: "related",
    default: null,
    required: false,
    related: "suppliers",
    options: false,
    half: false,
  },
  license: {
    label: "License",
    placeholder: "",
    type: "related",
    default: null,
    required: false,
    related: "constants",
    options: [{ name: "type", value: "licenses" }],
    half: false,
  },
  age: {
    label: "Age",
    placeholder: "",
    type: "related",
    default: null,
    required: false,
    related: "constants",
    options: [{ name: "type", value: "ages" }],
    half: false,
  },
};
