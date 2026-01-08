import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const Footer = ({className}:{className:string}) => {
  return (
    <footer
      id="foot"
      className={`relative bottom-0 flex flex-col bg-black text-[#dadada] mt-2 w-full ${className}`}
    >
      <section id="footercontent" className="flex justify-around ">
        <div className="w-[23%] flex flex-col pt-7">
              <div className="text-4xl font-bold">Company</div>
              <div className="w-full flex flex-col pt-7 text-left h-[50vh]" >
                <div className="underline pl-2">About Us</div>
                <div className="underline pl-2">Careers</div>
                <div className="underline pl-2"> Contact Us</div>
                <div className="underline pl-2">Privacy</div>
                <div className="underline pl-2">Policy</div>
                <div className="underline pl-2">Terms & Conditions</div>
              </div>
            </div>
        <div className="w-[23%] flex flex-col pt-7">
              <div className="text-4xl font-bold">Shop</div>
              <div className="w-full flex flex-col pt-7 text-left h-[50vh]">
                <div className="underline pl-2">Men</div>
                <div className="underline pl-2">Women</div>
                <div className="underline pl-2">Boys</div>
                <div className="underline pl-2">Girls</div>
                <div className="underline pl-2">Unisex</div>
                <div className="underline pl-2">Accessories</div>
                <div className="underline pl-2">Offers</div>
              </div>
            </div>
        <div className="w-[23%] flex flex-col  pt-7">
          <div className="text-4xl font-bold">Customer Care</div>
          <div className="w-full flex flex-col pt-7 text-left h-[50vh]">
            <div className="underline pl-2">Track</div>
            <div className="underline pl-2">Order</div>
            <div className="underline pl-2">Returns & Refunds</div>
            <div className="underline pl-2">Shipping</div>
            <div className="underline pl-2">Information</div>
            <div className="underline pl-2">Size Guide</div>
            <div className="underline pl-2">FAQs</div>
          </div>
        </div>
        <div className="w-[23%] flex flex-col pt-7">
          <div className="text-4xl font-bold">
            Contact Us
          </div>
          <div className="w-full flex flex-col pt-7 gap-5 text-left h-[50vh]">
            <div className="">
            Address: GF 11, Augusta Point, Golf Course Rd, Parsvnath Exotica,
            DLF Phase 5, Sector 53, Gurugram, Haryana 122011
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

              <div className="cursor-pointer text-gray-400 hover:text-[#272727] border p-2  rounded-xl duration-300">
                <a href="https://x.com" target="_blank">
                  <FaXTwitter size={23} />
                </a>
              </div>

              <div className="cursor-pointer text-gray-400 hover:text-[#FF0000] border p-2  rounded-xl duration-300">
                <a href="https://youtube.com" target="_blank">
                  <FaYoutube size={23} />
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
