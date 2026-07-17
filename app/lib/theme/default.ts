import { SiteTheme } from "./types";

const defaultTheme: SiteTheme = {
  page: {
    background: "",
  },

  productCard: {
    outer: "",

    inner: "",

    image: "",

    button: "bg-[#5f5143] text-white hover:bg-[#6a0f1f]",

    badge: "bg-red-600 text-white",
  },

  staticCard: {
    outer: "",
    inner: "",
    image: "",
    badge: "",
  },
};

export default defaultTheme;
