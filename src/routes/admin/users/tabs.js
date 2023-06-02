export const PageTabs = (type, id) => {
  let path = "/admin/users";
  let tabs = [
    {
      name: "General",
      link: `${path}/${type}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Password", link: `${path}/${type}/${id}/password` },
    ];
  }

  return tabs
};
