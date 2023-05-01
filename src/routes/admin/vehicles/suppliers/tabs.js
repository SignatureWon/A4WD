export const PageTabs = (id) => {
  let path = "/admin/vehicles/suppliers";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Depots", link: `${path}/${id}/depots` },
        { name: "Emails", link: `${path}/${id}/emails` },
    ];
  }

  return tabs
};
