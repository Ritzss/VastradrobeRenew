"use client";

import { ArrowUpRight, Sun, Moon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaAmazon,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa6";
import { useAppContext } from "@/hooks/useAppContext";

import img from "../../../public/Assets/Images/logoV2.png";

const Footer = () => {
  const { theme, toggleTheme } = useAppContext();
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
    <footer className="not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] dark:bg-black/90 text-[#5f5143] dark:text-neutral-300 border-t border-neutral-100 dark:border-neutral-900 transition duration-300">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-14 md:pt-20 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          
          {/* BRAND (Reverted to your original PNG logo in the footer only) */}
          <Link href="/" className="text-center flex flex-col items-center">
            <Image
              src={img}
              alt="VastraDrobe"
              width={280}
              height={280}
              className="w-36 sm:w-44 md:w-48 h-auto"
            />

            <h3 className="text-xs font-semibold mt-4 dark:text-white">
              VastraDrobe - Your Modern Indian Wardrobe
            </h3>

            <p className="mt-4 text-sm text-[#7a6a5c] dark:text-neutral-400 max-w-sm">
              Crafted for everyday elegance. Designed with intention. Worn with
              confidence.
            </p>
          </Link>

          {/* SHOP */}
          <div className="space-y-5 text-center sm:text-left">
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a] dark:text-neutral-400">
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
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a] dark:text-neutral-400">
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
            <h4 className="uppercase tracking-[0.25em] text-xs text-[#957f6a] dark:text-neutral-400">
              Visit Us
            </h4>

            <div className="relative rounded-3xl overflow-hidden border border-[#e6d8c8] dark:border-neutral-800 shadow-[0_20px_60px_rgba(149,127,106,0.12)]">
              <div className="absolute inset-0 bg-[#f3e7d8]/40 dark:bg-black/40 pointer-events-none mix-blend-multiply z-10" />

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3508.188857139117!2d77.09748757545684!3d28.44372279262982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19053c00df5f%3A0x190bb5aedb9410d1!2sVastradrobe%20India%20Private%20Limited!5e0!3m2!1sen!2sin!4v1770965132563!5m2!1sen!2sin"
                loading="lazy"
                className="w-full h-52 sm:h-60 border-0"
              />
            </div>

            <div className="text-sm text-[#7a6a5c] dark:text-neutral-400 leading-relaxed">
              <p>
                GF 43, Augusta Point, Golf Course Rd,
                <br />
                DLF Phase 5, Gurugram,
                <br />
                Haryana 122011
              </p>

              <a
                href="tel:+918800513926"
                className="block mt-3 hover:text-[#6a0f1f] dark:hover:text-[#e4e198] transition"
              >
                +91 9910953926
              </a>

              <a
                href="mailto:support@vastradrobe.com"
                className="block hover:text-[#6a0f1f] dark:hover:text-[#e4e198] transition"
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

        {/* FOOTER BOTTOM: COPYRIGHT & THEME TOGGLE */}
        <div className="border-t border-[#e6d8c8] dark:border-neutral-800 mt-14 md:mt-20 pt-6 md:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8a7b6c] dark:text-neutral-500">
          <div>Copyright © 2026 VastraDrobe. All rights reserved.</div>
          
          {/* 🌗 CIRCLE GROW THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#e6d8c8] dark:border-neutral-800 hover:border-[#6a0f1f] dark:hover:border-[#e4e198] bg-white dark:bg-neutral-900 text-[#5f5143] dark:text-neutral-300 font-semibold uppercase tracking-wider text-[10px] cursor-pointer shadow-xs transition duration-200"
            title="Toggle Theme Mode"
          >
            {theme === "dark" ? (
              <>
                <Sun size={13} className="text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={13} className="text-neutral-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
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
        className="group flex items-center gap-2 hover:text-[#6a0f1f] dark:hover:text-[#e4e198] transition"
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
        className="w-10 h-10 flex items-center justify-center rounded-full bg-[#efe3d3] dark:bg-neutral-900 text-[#5f5143] dark:text-neutral-300 hover:bg-[#6a0f1f] dark:hover:bg-[#6A0F1F] hover:text-white transition duration-300"
      >
        {children}
      </a>
    </>
  );
}

export default Footer;
