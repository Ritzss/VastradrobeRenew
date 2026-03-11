import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaAmazon,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  const category = ["Men", "Women", "Kids"];
  const customer = [
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
    <footer className="bg-[#f9f5ef] text-[#5f5143]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Brand */}
        <div className="text-center mb-20">
          <h3 className="text-2xl font-semibold tracking-wide">VastraDrobe</h3>
          <p className="mt-4 text-sm text-[#7a6a5c] max-w-xl mx-auto">
            Crafted for everyday elegance. Designed with intention. Worn with
            confidence.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-16 text-sm">
          {/* SHOP */}
          <div className="space-y-6">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
              Shop
            </h4>
            <div className="flex flex-col gap-3">
              {category.map((item, index) => (
                <FooterLink
                  key={index}
                  href={`/${slugify(item)}`}
                  label={item}
                />
              ))}
            </div>
          </div>

          {/* CUSTOMER */}
          <div className="space-y-6">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
              Customer Care
            </h4>
            <div className="flex flex-col gap-3">
              <FooterLink href="/orders" label="Orders & Tracking" />
              {customer.map((item, index) => (
                <FooterLink
                  key={index}
                  href={`/policies/${slugify(item)}`}
                  label={item}
                />
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div className="space-y-6">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
              Visit Us
            </h4>

            {/* Stylized Map */}
            <div className="relative rounded-[28px] overflow-hidden border border-[#e6d8c8] shadow-[0_20px_60px_rgba(149,127,106,0.12)]">
              {/* Soft tint overlay */}
              <div className="absolute inset-0 bg-[#f3e7d8]/40 pointer-events-none mix-blend-multiply z-10"></div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.188857139117!2d77.09748757545684!3d28.44372279262982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19053c00df5f%3A0x190bb5aedb9410d1!2sVastradrobe%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1770965132563!5m2!1sen!2sin"
                loading="lazy"
                className="w-full h-[220px] border-0"
              ></iframe>
            </div>

            <div className="text-[#7a6a5c] leading-relaxed">
              <p>
                GF 43, Augusta Point, Golf Course Rd, DLF Phase 5, Gurugram,
                Haryana 122011
              </p>

              <a
                href="tel:+918800513926"
                className="block mt-3 hover:text-[#6a0f1f] hover:underline"
              >
                +91 8800513926
              </a>

              <a
                href="mailto:support@vastradrobe.com"
                className="block hover:text-[#6a0f1f] hover:underline"
              >
                support@vastradrobe.com
              </a>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 pt-4">
              <SocialIcon href="https://www.facebook.com/people/Vastradrobe/61579704217653/">
                <FaFacebookF />
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/vastradrobe/">
                <FaInstagram />
              </SocialIcon>
              <SocialIcon href="https://www.amazon.in/stores/VASTRADROBE/page/30369E04-11CD-44B1-80D6-FCF332FBA59E">
                <FaAmazon />
              </SocialIcon>
              <SocialIcon href="https://chat.whatsapp.com/EvtOGkMPxx59bJZuQWZc4b">
                <FaWhatsapp />
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/@vastradrobe">
                <FaYoutube />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="border-t border-[#e6d8c8] mt-20 pt-8 text-center text-xs text-[#8a7b6c]">
          © 2026 VastraDrobe. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between hover:text-[#6a0f1f] transition w-fit gap-2"
    >
      <span>{label}</span>
      <span className="opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
        <ArrowUpRight size={16} />
      </span>
    </Link>
  );
}

function SocialIcon({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      className=" w-10 h-10 flex items-center justify-center rounded-full bg-[#efe3d3] text-[#5f5143] hover:bg-[#6a0f1f] hover:text-white transition duration-300"
    >
      {children}
    </a>
  );
}

export default Footer;
