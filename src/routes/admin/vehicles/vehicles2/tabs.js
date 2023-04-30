export const PageTabs = (id) => {
  let path = "/admin/vehicles/vehicles2";
  let tabs = [
    {
      name: "General",
      link: `${path}/${id}`,
    },
    // {
    //   name: "Seasons",
    //   link: `${data.path}/seasons`
    // },
  ];

  if (id !== "add") {
    tabs = [
        ...tabs,
        { name: "Contents", link: `${path}/${id}/contents` },
        { name: "Specifications", link: `${path}/${id}/specifications` },
        { name: "FAQs", link: `${path}/${id}/faqs` },
        { name: "Gallery", link: `${path}/${id}/gallery` },
    ];
  }

  return tabs
};
