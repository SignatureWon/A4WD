export const PageTabs = (id) => {
  let path = "/admin/vehicles/bonds";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Compulsory", link: `${path}/${id}/compulsory` },
    ];
  }

  return tabs
};
