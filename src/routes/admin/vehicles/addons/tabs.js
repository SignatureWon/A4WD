export const PageTabs = (id) => {
  let path = "/admin/vehicles/addons";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Addons", link: `${path}/${id}/addons` },
    ];
  }

  return tabs
};
