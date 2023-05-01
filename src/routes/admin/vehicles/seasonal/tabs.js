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
        { name: "Seasons", link: `${path}/${id}/seasons` },
    ];
  }

  return tabs
};
