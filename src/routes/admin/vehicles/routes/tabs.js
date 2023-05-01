export const PageTabs = (id) => {
  let path = "/admin/vehicles/routes";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Routes", link: `${path}/${id}/routes` },
    ];
  }

  return tabs
};
