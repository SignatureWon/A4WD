import dayjs from "dayjs";
export const fees = {
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
  description: {
    label: "Description",
    placeholder: "",
    type: "textarea",
    default: null,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  all_vehicles: {
    label: "Vehicles",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "fees_vehicles",
    half: false,
  },
  all_depots: {
    label: "Depots",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "fees_depots",
    half: false,
  },
  all_suppliers: {
    label: "Suppliers",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "fees_suppliers",
    half: false,
  },
  pickup: {
    label: "Pick-up",
    placeholder: "",
    type: "switch",
    default: false,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  dropoff: {
    label: "Drop-off",
    placeholder: "",
    type: "switch",
    default: false,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  return: {
    label: "Return to base",
    placeholder: "",
    type: "switch",
    default: false,
    required: false,
    related: false,
    options: false,
    half: false,
  },
  fee: {
    label: "Fee",
    placeholder: "",
    type: "number",
    default: false,
    required: false,
    related: false,
    options: 0.1,
    half: false,
  },
};
