export const PageTabs = (id) => {
  let path = "/admin/vehicles/seasonal";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Rates", link: `${path}/${id}/rates` },
    ];
  }

  return tabs
};
