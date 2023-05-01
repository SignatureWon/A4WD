export const PageTabs = (id) => {
  let path = "/admin/contents";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Gallery", link: `${path}/${id}/gallery` },
    ];
  }

  return tabs
};
