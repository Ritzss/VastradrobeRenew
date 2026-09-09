import { SiteTheme } from "./types";

const independenceTheme: SiteTheme = {
  page: {
    background:
      "bg-gradient-to-br from-orange-50 via-white to-green-50",
  },

  productCard: {
  outer:
    "bg-gradient-to-br from-orange-400 via-white to-green-500 p-[1px] rounded-[2rem]",

  inner:
    "rounded-[calc(2rem-1px)] bg-white",

  image:
    "",

  button:
    "bg-gradient-to-r from-orange-500 to-green-600 text-white hover:opacity-90",

  badge:
    "bg-gradient-to-r from-orange-500 via-white to-green-600 text-black",
},

  staticCard: {
    outer:
      "bg-gradient-to-br from-orange-400 via-white to-green-500 p-[1px] rounded-xl",

    inner:
      "rounded-[calc(.75rem-1px)] bg-white",

    image:
      "",

    badge:
      "bg-gradient-to-r from-orange-500 to-green-600 text-white",
  },
};

export default independenceTheme;