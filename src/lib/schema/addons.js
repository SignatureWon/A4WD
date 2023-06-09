import dayjs from "dayjs";
export const addons = {
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
  link: {
    label: "Link",
    placeholder: "",
    type: "text",
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
    options: "addons_vehicles",
    half: false,
  },
  all_suppliers: {
    label: "Suppliers",
    placeholder: "",
    type: "many",
    default: false,
    required: false,
    related: false,
    options: "addons_suppliers",
    half: false,
  },
  addons: {
    label: "Addons",
    placeholder: "",
    type: "addons",
    default: false,
    required: false,
    related: false,
    options: false,
    half: false,
  },
};
