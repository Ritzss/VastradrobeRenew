import Link from "next/link";
import { FaAmazon, FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa6";

const Footer = ({ className }: { className?: string }) => {
  const underline =
    "cursor-pointer hover:scale-105 hover:text-shadow-[0_0_10px_#ffffff] duration-500 transition-all underline pl-2";
  const Address = "https://maps.app.goo.gl/PukzZvvqVvtfiHRD7";

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
      className={`bg-[#6a0f1f] text-[#EEDDC7] mt-6 w-full ${className ?? ""}`}
    >
      {/* MAIN CONTENT */}
      <section
        id="footercontent"
        className="max-w-7xl md:text-start text-center mx-auto px-6 py-12 md:flex justify-evenly gap-10"
      >
        {/* SHOP */}
        <div className="flex flex-col gap-6 md:w-[33%]">
          <h3 className="text-xl md:text-2xl font-semibold">Shop</h3>
          {Category.map((item, index) => (
            <div key={index} className={underline}>
              <Link href={`/${slugify(item)}`}>{item}</Link>
            </div>
          ))}
        </div>

        {/* CUSTOMER CARE */}
        <div className="flex flex-col gap-6 md:w-[33%]">
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
        <div className="flex flex-col gap-6 md:w-[33%]">
          <h3 className="text-xl md:text-2xl font-semibold">Contact Us</h3>

          <div className="text-sm leading-relaxed">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.188857139117!2d77.09748757545684!3d28.44372279262982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19053c00df5f%3A0x190bb5aedb9410d1!2sVastradrobe%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1770965132563!5m2!1sen!2sin"
              className="border-0 mx-auto lg:w-85 md:w-60 md:h-55 w-68 h-35 mb-2 rounded-xl"
              loading="lazy"
            ></iframe>
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
              href="https://www.facebook.com/people/Vastradrobe/61579704217653/"
              target="_blank"
              className="text-gray-400 hover:text-[#1877F2] border p-2 rounded-lg transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.instagram.com/vastradrobe/"
              target="_blank"
              className="text-gray-400 hover:text-[#d10a5d] border p-2 rounded-lg transition"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://www.amazon.in/stores/VASTRADROBE/page/30369E04-11CD-44B1-80D6-FCF332FBA59E?lp_asin=B0FRZ85JJF&ref_=ast_bln&store_ref=bl_ast_dp_brandLogo_sto"
              target="_blank"
              className="text-gray-400 hover:text-[#d10a5d] border p-2 rounded-lg transition"
            >
              <FaAmazon size={20} />
            </a>
            <a
              href="https://chat.whatsapp.com/EvtOGkMPxx59bJZuQWZc4b"
              target="_blank"
              className="text-gray-400 hover:text-[#d10a5d] border p-2 rounded-lg transition"
            >
              <FaWhatsapp size={20} />
            </a>
            <a
              href="https://www.youtube.com/@vastradrobe"
              target="_blank"
              className="text-gray-400 hover:text-[#d10a5d] border p-2 rounded-lg transition"
            >
              <FaYoutube size={20} />
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
