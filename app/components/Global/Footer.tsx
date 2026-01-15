import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa6";

const Footer = ({ className }: { className: string }) => {
  const underline =
    "cursor-pointer hover:scale-105 hover:text-shadow-[0_0_10px_#ffffff] duration-500 transition-all underline pl-2";
  const Address =
    "http://google.com/maps/place/ADS247365+India+Private+Limited/@28.4437138,76.9476199,12z/data=!4m19!1m12!4m11!1m3!2m2!1d77.0999762!2d28.4434616!1m6!1m2!1s0x390d19bb11de70e7:0xb99f2f53e75a85f6!2sGF+11,+ADS247365+India+Private+Limited,+Augusta+Point,+Golf+Course+Rd,+Parsvnath+Exotica,+DLF+Phase+5,+Sector+53,+Gurugram,+Haryana+122011!2m2!1d77.1000625!2d28.4437181!3m5!1s0x390d19bb11de70e7:0xb99f2f53e75a85f6!8m2!3d28.4437181!4d77.1000625!16s%2Fg%2F11td39q2r6?entry=ttu&g_ep=EgoyMDI2MDEwNy4wIKXMDSoASAFQAw%3D%3D";

  const Company = [
    "About Us",
    "Careers",
    "Contact Us",
    "Privacy",
    "Policy",
    "Terms & Conditions",
  ];
  const Category = [
    "Men",
    "Women",
    "Boys",
    "Girls",
    "Western",
    "Traditional",
    "Offers",
  ];
  const Customer = [
    "Track",
   
    "Returns & Refunds",
    "Shipping",
    "Information",
    "Size Guide",
    "FAQs",
  ];

  const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

  return (
    <footer
      id="foot"
      className={`relative bottom-0 flex flex-col bg-black text-[#dadada] mt-2 w-full ${className}`}
    >
      <section id="footercontent" className="flex justify-around ">
        <div className="w-[23%] flex flex-col pt-7">
          <div className="text-4xl font-bold">Company</div>
          <div className="w-full flex flex-col pt-7 text-left h-[50vh]">
            {Company.map((items, index) => {
              return (
                <div key={index} className={underline}>
                  <Link href={`/contactus/${slugify(items)}`}>
                    {items}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[23%] flex flex-col pt-7">
          <div className="text-4xl font-bold">Shop</div>
          <div className="w-full flex flex-col pt-7 text-left h-[50vh]">
            {Category.map((items, index) => {
              return (
                <div key={index} className={underline}>
                  <Link href={`/${slugify(items)}`}>{items}</Link>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-[23%] flex flex-col  pt-7">
          <div className="text-4xl font-bold">Customer Care</div>
          <div className="w-full flex flex-col pt-7 text-left h-[50vh]">
            <div className={underline}>
              <Link href={"/orders"}>Orders</Link>
            </div>
            {Customer.map((items, index) => {
              return (
                <div key={index} className={underline}>
                  <Link href={`/help/${slugify(items)}`}>{items}</Link>
                </div>
                
              );
            })}
          </div>
        </div>
        <div className="w-[23%] flex flex-col pt-7">
          <div className="text-4xl font-bold">Contact Us</div>
          <div className="w-full flex flex-col pt-7 gap-5 text-left h-[50vh]">
            <div className="">
              <Link href={Address} target="_blank">
                Address
              </Link>{" "}
              : GF 43, Augusta Point, Golf Course Rd, Parsvnath Exotica, DLF
              Phase 5, Sector 53, Gurugram, Haryana 122011
            </div>
            <div>Phone: 080539 43352</div>
            <div className="text-xl">
              Social Media:
              <div className="flex gap-4 items-center">
                <div className="cursor-pointer text-gray-400 hover:text-[#1877F2] border p-2  rounded-xl duration-300">
                  <a href="https://facebook.com" target="_blank">
                    <FaFacebookF size={23} />
                  </a>
                </div>
                <div className="cursor-pointer text-gray-400 hover:text-[#d10a5d] border p-2  rounded-xl duration-300">
                  <a href="https://instagram.com" target="_blank">
                    <FaInstagram size={23} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full text-center ">
        © 2025 VastraDrobe. All rights reserved. Crafted with ❤️ for everyday
        fashion.
      </section>
    </footer>
  );
};

export default Footer;
