"use client";

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
    <footer className="bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] text-[#5f5143] border-t border-neutral-100 transition duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          {/* BRAND (Using crisp vector SVG brand mark) */}
          <Link href="/" className="text-center flex flex-col items-center">
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1040.62 300.82"
              className="w-44 sm:w-52 h-auto"
            >
              <defs>
                <style>{`.cls-1 { fill: #cf1f31; }`}</style>
              </defs>
              <g>
                <path
                  className="cls-1"
                  d="M402.55,156.31v141.87h-12.98v-17.59c-5.52,6.71-11.71,11.76-18.58,15.15-6.87,3.39-14.38,5.08-22.53,5.08-14.49,0-26.86-5.25-37.11-15.76-10.25-10.5-15.38-23.28-15.38-38.34s5.17-27.34,15.52-37.82c10.35-10.47,22.8-15.71,37.35-15.71,8.4,0,16.01,1.79,22.81,5.36,6.8,3.58,12.78,8.94,17.92,16.09v-58.33h12.98ZM349.91,205.89c-7.33,0-14.1,1.8-20.3,5.4-6.2,3.6-11.14,8.66-14.8,15.18-3.67,6.51-5.5,13.41-5.5,20.67s1.85,14.1,5.54,20.67c3.7,6.58,8.66,11.7,14.89,15.36,6.23,3.67,12.92,5.5,20.06,5.5s14.03-1.82,20.49-5.45c6.45-3.63,11.42-8.55,14.89-14.75,3.48-6.2,5.21-13.19,5.21-20.96,0-11.84-3.9-21.74-11.7-29.7-7.8-7.96-17.4-11.93-28.8-11.93Z"
                />
                <path
                  className="cls-1"
                  d="M427.39,195.83h13.45v14.96c4.01-5.9,8.25-10.3,12.7-13.22,4.45-2.92,9.09-4.37,13.92-4.37,3.64,0,7.53,1.16,11.67,3.48l-6.87,11.1c-2.76-1.19-5.08-1.79-6.96-1.79-4.39,0-8.62,1.8-12.7,5.41-4.08,3.61-7.18,9.21-9.31,16.79-1.63,5.83-2.45,17.62-2.45,35.37v34.62h-13.45v-102.36Z"
                />
                <path
                  className="cls-1"
                  d="M783.29,234.54c-.15-.65-.31-1.29-.49-1.92-2.5-9.08-7.33-17.19-13.81-23.67-3.96-3.96-8.53-7.3-13.56-9.87-.77-.4-1.56-.78-2.35-1.14-6.75-3.05-14.25-4.75-22.14-4.75h-89.54v-8.25c17.7-3.02,31.18-18.44,31.18-37,0-20.72-16.81-37.53-37.54-37.53-11.13,0-21.13,4.85-28.01,12.56l8.65,8.65c4.63-5.51,11.59-9.01,19.36-9.01,14,0,25.34,11.34,25.34,25.33,0,11.81-8.06,21.72-18.98,24.53-2.04.53-4.17.81-6.36.81s-4.31-.28-6.34-.81v20.72h-89.55c-8.04,0-15.67,1.76-22.52,4.93-.67.3-1.33.62-1.98.96-10.06,5.15-18.28,13.37-23.42,23.43-.4.77-.78,1.56-1.14,2.35-3.05,6.75-4.75,14.25-4.75,22.14s1.7,15.39,4.75,22.15c.36.79.74,1.58,1.14,2.35,2.57,5.03,5.91,9.6,9.87,13.56,3.96,3.96,8.53,7.3,13.55,9.87.65.34,1.31.66,1.98.96,2.5,1.16,5.1,2.13,7.79,2.89.85.24,1.71.46,2.58.66,3.9.9,7.97,1.38,12.15,1.38h191.79c6.5,0,12.73-1.15,18.5-3.27.83-.3,1.64-.62,2.44-.96.68-.29,1.35-.59,2.01-.9.66-.31,1.3-.63,1.94-.97.35-.18.7-.37,1.05-.56.7-.38,1.38-.78,2.06-1.19.33-.21.67-.42,1-.63,1.46-.93,2.87-1.93,4.22-3,.42-.33.84-.68,1.26-1.02,1.24-1.04,2.43-2.13,3.57-3.27,3.96-3.95,7.3-8.52,9.87-13.55.34-.65.66-1.31.96-1.98,1.21-2.6,2.21-5.32,2.98-8.13.18-.63.34-1.27.49-1.92.96-4,1.46-8.18,1.46-12.47s-.5-8.46-1.46-12.46ZM730.28,288.12h-190.47c-11.35,0-21.63-4.6-29.07-12.04s-12.04-17.72-12.04-29.08c0-22.7,18.41-41.11,41.11-41.11h190.47c11.35,0,21.63,4.6,29.07,12.04,7.44,7.44,12.04,17.72,12.04,29.07,0,22.71-18.41,41.12-41.11,41.12Z"
                />
                <g>
                  <path
                    className="cls-1"
                    d="M809.53,298.07v-141.77h13.16v57.07c5.51-6.77,11.68-11.83,18.5-15.18,6.82-3.35,14.31-5.03,22.45-5.03,14.46,0,26.81,5.25,37.05,15.75,10.24,10.5,15.36,23.24,15.36,38.22s-5.17,27.42-15.5,37.89c-10.33,10.47-22.76,15.7-37.29,15.7-8.33,0-15.87-1.79-22.63-5.36-6.76-3.57-12.74-8.93-17.94-16.08v18.8h-13.16ZM862.18,288.01c7.32,0,14.07-1.8,20.26-5.41,6.19-3.6,11.11-8.66,14.77-15.18,3.66-6.52,5.49-13.41,5.49-20.68s-1.85-14.2-5.53-20.78c-3.69-6.58-8.65-11.7-14.87-15.37-6.22-3.67-12.87-5.5-19.93-5.5s-14.02,1.83-20.5,5.5c-6.47,3.67-11.44,8.6-14.91,14.81-3.47,6.21-5.21,13.19-5.21,20.97,0,11.85,3.89,21.75,11.68,29.71,7.79,7.96,17.37,11.94,28.75,11.94Z"
                  />
                  <path
                    className="cls-1"
                    d="M1026.14,264.14l11.09,5.83c-3.64,7.15-7.84,12.91-12.61,17.3-4.77,4.39-10.13,7.73-16.09,10.01-5.96,2.29-12.71,3.43-20.23,3.43-16.69,0-29.73-5.47-39.15-16.41-9.41-10.94-14.12-23.3-14.12-37.09,0-12.97,3.98-24.54,11.95-34.69,10.1-12.91,23.62-19.37,40.56-19.37s31.37,6.61,41.78,19.84c7.4,9.34,11.17,21,11.29,34.97h-92.04c.25,11.88,4.05,21.62,11.39,29.22,7.34,7.6,16.41,11.4,27.2,11.4,5.21,0,10.27-.9,15.2-2.72,4.93-1.81,9.11-4.21,12.57-7.21s7.19-7.84,11.2-14.52ZM1026.14,236.59c-1.76-7.02-4.31-12.63-7.67-16.83-3.36-4.2-7.8-7.58-13.32-10.15-5.52-2.57-11.33-3.85-17.41-3.85-10.04,0-18.67,3.23-25.89,9.68-5.27,4.7-9.26,11.75-11.95,21.15h76.25Z"
                  />
                </g>
              </g>
              <g>
                <path
                  className="cls-1"
                  d="M0,1.98h15.05l45.86,106.92L107.53,1.98h15.05l-60.21,138.39h-3.01L0,1.98Z"
                />
                <path
                  className="cls-1"
                  d="M224.37,38.01v102.36h-12.98v-17.59c-5.52,6.71-11.71,11.76-18.58,15.15-6.87,3.39-14.38,5.08-22.53,5.08-14.49,0-26.86-5.25-37.11-15.76-10.25-10.51-15.38-23.29-15.38-38.34s5.17-27.34,15.52-37.82c10.35-10.47,22.8-15.71,37.35-15.71,8.4,0,16.01,1.79,22.81,5.36,6.8,3.58,12.78,8.94,17.92,16.09v-18.82h12.98ZM171.73,48.07c-7.33,0-14.1,1.8-20.3,5.4-6.2,3.6-11.14,8.66-14.8,15.18-3.66,6.52-5.5,13.41-5.5,20.67s1.85,14.1,5.54,20.67c3.7,6.58,8.66,11.7,14.89,15.36,6.23,3.67,12.92,5.5,20.06,5.5s14.03-1.82,20.49-5.45c6.45-3.63,11.42-8.55,14.89-14.75,3.48-6.2,5.22-13.19,5.22-20.96,0-11.84-3.9-21.74-11.7-29.69-7.8-7.95-17.4-11.93-28.8-11.93Z"
                />
                <path
                  className="cls-1"
                  d="M305.46,49.2l-8.47,8.75c-7.04-6.83-13.93-10.25-20.66-10.25-4.28,0-7.94,1.41-10.99,4.23-3.05,2.82-4.57,6.11-4.57,9.88,0,3.32,1.26,6.49,3.77,9.5,2.51,3.07,7.79,6.68,15.84,10.82,9.8,5.08,16.47,9.97,19.99,14.68,3.46,4.77,5.18,10.13,5.18,16.09,0,8.4-2.95,15.52-8.86,21.35-5.9,5.83-13.29,8.75-22.14,8.75-5.91,0-11.54-1.29-16.91-3.86-5.37-2.57-9.82-6.11-13.33-10.63l8.28-9.41c6.73,7.59,13.86,11.38,21.41,11.38,5.28,0,9.77-1.69,13.48-5.08,3.71-3.39,5.56-7.37,5.56-11.95,0-3.76-1.23-7.12-3.68-10.07-2.45-2.88-7.98-6.52-16.59-10.91-9.24-4.77-15.53-9.47-18.86-14.11-3.33-4.64-5-9.94-5-15.9,0-7.78,2.65-14.24,7.96-19.38,5.31-5.14,12.01-7.71,20.12-7.71,9.42,0,18.91,4.61,28.46,13.83Z"
                />
                <path
                  className="cls-1"
                  d="M340.27,0h13.17v38.01h20.89v11.38h-20.89v90.97h-13.17V49.39h-17.97v-11.38h17.97V0Z"
                />
                <path
                  className="cls-1"
                  d="M389.1,38.01h13.45v14.96c4.01-5.89,8.25-10.3,12.7-13.22,4.45-2.92,9.09-4.37,13.92-4.37,3.64,0,7.53,1.16,11.67,3.48l-6.87,11.1c-2.76-1.19-5.08-1.79-6.96-1.79-4.39,0-8.62,1.8-12.7,5.41-4.08,3.61-7.18,9.21-9.31,16.79-1.63,5.83-2.45,17.62-2.45,35.37v34.62h-13.45V38.01Z"
                />
                <path
                  className="cls-1"
                  d="M554.02,38.01v102.36h-12.98v-17.59c-5.52,6.71-11.71,11.76-18.58,15.15-6.87,3.39-14.38,5.08-22.53,5.08-14.49,0-26.86-5.25-37.11-15.76-10.25-10.51-15.38-23.29-15.38-38.34s5.17-27.34,15.52-37.82c10.35-10.47,22.8-15.71,37.35-15.71,8.4,0,16.01,1.79,22.81,5.36,6.8,3.58,12.78,8.94,17.92,16.09v-18.82h12.98ZM501.38,48.07c-7.33,0-14.1,1.8-20.3,5.4-6.2,3.6-11.14,8.66-14.8,15.18-3.66,6.52-5.5,13.41-5.5,20.67s1.85,14.1,5.54,20.67c3.7,6.58,8.66,11.7,14.89,15.36,6.23,3.67,12.92,5.5,20.06,5.5s14.03-1.82,20.49-5.45c6.45-3.63,11.42-8.55,14.89-14.75,3.48-6.2,5.22-13.19,5.22-20.96,0-11.84-3.9-21.74-11.7-29.69-7.8-7.95-17.4-11.93-28.8-11.93Z"
                />
              </g>
            </svg>

            <h3 className="text-xs font-semibold mt-4">
              VastraDrobe - Your Modern Indian Wardrobe
            </h3>

            <p className="mt-4 text-sm text-[#7a6a5c] max-w-sm">
              Crafted for everyday elegance. Designed with intention. Worn with
              confidence.
            </p>
          </Link>

          {/* SHOP */}
          <div className="space-y-5 text-center sm:text-left">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
              Shop
            </h4>

            <div className="flex flex-col gap-3 items-center sm:items-start">
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
          <div className="space-y-5 text-center sm:text-left">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
              Customer Care
            </h4>

            <div className="flex flex-col gap-3 items-center sm:items-start">
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
          <div className="space-y-5 text-center">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a]">
              Visit Us
            </h4>

            <div className="relative rounded-3xl overflow-hidden border border-[#e6d8c8] shadow-[0_20px_60px_rgba(149,127,106,0.12)]">
              <div className="absolute inset-0 bg-[#f3e7d8]/40 pointer-events-none mix-blend-multiply z-10" />

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.188857139117!2d77.09748757545684!3d28.44372279262982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19053c00df5f%3A0x190bb5aedb9410d1!2sVastradrobe%20India%Private%20Limited!5e0!3m2!1sen!2sin!4v1770965132563!5m2!1sen!2sin"
                loading="lazy"
                className="w-full h-52 sm:h-60 border-0"
              />
            </div>

            <div className="text-sm text-[#7a6a5c] leading-relaxed">
              <p>
                GF 43, Augusta Point, Golf Course Rd,
                <br />
                DLF Phase 5, Gurugram,
                <br />
                Haryana 122011
              </p>

              <a
                href="tel:+918800513926"
                className="block mt-3 hover:text-[#6a0f1f] transition"
              >
                +91 9910953926
              </a>

              <a
                href="mailto:support@vastradrobe.com"
                className="block hover:text-[#6a0f1f] transition"
              >
                support@vastradrobe.com
              </a>
            </div>

            <div className="flex justify-center gap-3 flex-wrap pt-2">
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

        {/* FOOTER BOTTOM: COPYRIGHT */}
        <div className="border-t border-[#e6d8c8] mt-14 md:mt-20 pt-6 md:pt-8 text-center text-xs text-[#8a7b6c]">
          <div>Copyright © 2026 VastraDrobe. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <>
      <Link
        href={href}
        className="group flex items-center gap-2 hover:text-[#6a0f1f] transition"
        title={label}
      >
        <span>{label}</span>

        <ArrowUpRight
          size={15}
          className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
        />
      </Link>
    </>
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
    <>
      <a
        href={href}
        target="_blank"
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#efe3d3] text-[#5f5143] hover:bg-[#6a0f1f] hover:text-white transition duration-300"
      >
        {children}
      </a>
    </>
  );
}

export default Footer;
