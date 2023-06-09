import dayjs from "dayjs";
export const blockouts = {
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
  all_vehicles: {
    label: "Vehicles",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "blockouts_vehicles",
    half: false,
  },
  all_depots: {
    label: "Depots",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "blockouts_depots",
    half: false,
  },
  all_suppliers: {
    label: "Suppliers",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "blockouts_suppliers",
    half: false,
  },
  status: {
    label: "Status",
    placeholder: "",
    type: "switch",
    default: true,
    required: false,
    related: false,
    options: "Active",
    half: true,
  },
};
