import Link from "next/link";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";

const Footer = ({ className }: { className?: string }) => {
  const underline =
    "cursor-pointer hover:scale-105 hover:text-shadow-[0_0_10px_#ffffff] duration-500 transition-all underline pl-2";
  const Address =
    "http://google.com/maps/place/ADS247365+India+Private+Limited/@28.4437138,76.9476199,12z/data=!4m19!1m12!4m11!1m3!2m2!1d77.0999762!2d28.4434616!1m6!1m2!1s0x390d19bb11de70e7:0xb99f2f53e75a85f6!2sGF+11,+ADS247365+India+Private+Limited,+Augusta+Point,+Golf+Course+Rd,+Parsvnath+Exotica,+DLF+Phase+5,+Sector+53,+Gurugram,+Haryana+122011!2m2!1d77.1000625!2d28.4437181!3m5!1s0x390d19bb11de70e7:0xb99f2f53e75a85f6!8m2!3d28.4437181!4d77.1000625!16s%2Fg%2F11td39q2r6?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D";

  const Category = ["Men", "Women", "Kids", "Ethnic"];
  const Customer = [
    "Returns & Refunds",
    "Shipping",
    "Information",
    "Privacy & Policy",
    "Terms & Conditions",
    "Size Guide",
    "FAQs",
  ];

  const slugify = (text: string) =>
    text.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");

  return (
    <footer
      id="foot"
      className={`bg-[#000000cf] text-[#dadada] mt-6 w-full ${className ?? ""}`}
    >
      {/* MAIN CONTENT */}
      <section
        id="footercontent"
        className="  max-w-7xl mx-auto  px-6 py-12  flex justify-evenly  gap-10"
      >

        {/* SHOP */}
        <div className="flex flex-col gap-6 w-[33%]">
          <h3 className="text-xl md:text-2xl font-semibold">Shop</h3>
          {Category.map((item, index) => (
            <div key={index} className={underline}>
              <Link href={`/${slugify(item)}`}>{item}</Link>
            </div>
          ))}
        </div>

        {/* CUSTOMER CARE */}
        <div className="flex flex-col gap-6 w-[33%]">
          <h3 className="text-xl md:text-2xl font-semibold">Customer Care</h3>
          <div className={underline}>
            <Link href="/orders">Orders & Track</Link>
          </div>
          {Customer.map((item, index) => (
            <div key={index} className={underline}>
              <Link href={`/policies/${slugify(item)}`}>{item}</Link>
            </div>
          ))}
        </div>

        {/* CONTACT */}
        <div className="flex flex-col gap-6 w-[33%]">
          <h3 className="text-xl md:text-2xl font-semibold">Contact Us</h3>

          <div className="text-sm leading-relaxed text-gray-300">
            <Link
              href={Address}
              target="_blank"
              className="underline hover:text-white"
            >
              Address
            </Link>
            <p className="mt-2">
              GF 43, Augusta Point, Golf Course Rd, Parsvnath Exotica, DLF Phase
              5, Sector 53, Gurugram, Haryana 122011
            </p>
          </div>

          <div className="text-sm">Phone: 080539 43352</div>

          <div className="flex gap-4 items-center">
            <a
              href="https://facebook.com"
              target="_blank"
              className="text-gray-400 hover:text-[#1877F2] border p-2 rounded-lg transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              className="text-gray-400 hover:text-[#d10a5d] border p-2 rounded-lg transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* BOTTOM BAR */}
      <section className="border-t border-white/10 py-4 text-center text-sm text-gray-400">
        © 2025 VastraDrobe. All rights reserved. Crafted with ❤️ for everyday
        fashion.
      </section>
    </footer>
  );
};

export default Footer;
