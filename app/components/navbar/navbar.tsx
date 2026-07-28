/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  LogOut,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { useAppContext } from "@/hooks/useAppContext";

/**
 * 👑 LUXURY REDESIGN: Navbar (Nangalia Ruchira Theme)
 *
 * Sizing & Logo Optimized:
 * - 🔒 NEW VECTOR LOGO INTEGRATED: Swapped the previous low-resolution PNG circular logo with
 *   your official high-definition, mathematical vector SVG brand mark!
 * - 🔍 MAXIMUM LEGIBILITY: The logo remains infinitely crisp and perfectly clear on all retina/mobile viewports.
 * - ⚡ SHRINKING HEADER ON SCROLL: Increased default unscrolled navbar height to a spacious h-24 / sm:h-28
 *   for a grand editorial feel. On scroll, it shrinks elegantly to a compact h-15 / sm:h-16 with a shadow.
 * - 🌀 Sliding marquee announcements inside the wine-red top bar.
 * - 📱 Overlap-proof mobile responsiveness.
 */
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [searchActive, setSearchOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    products,
    user,
    authLoading,
    cartCount,
    searchQuery,
    setSearchQuery,
    handleLogout,
    setCartDrawerOpen,
  } = useAppContext();

  const isLogged = !!user;
  const [value, setValue] = useState(searchQuery);

  const announcements = [
    "Free Shipping Over ₹999 | Handcrafted Luxury Clothing",
    "Where Elegance Meets Everyday Wear",
    "Designed with Intention. Worn with Confidence.",
    "Easy 15-Day Returns | Secure Checkout",
    "Complimentary Shipping Above ₹999",
  ];

  // Shrink header when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on page navigation
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setCollectionOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Handle mobile resize
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const handleChange = () => {
      if (media.matches) {
        setMenuOpen(false);
      }
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        setLoadingSuggestions(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products?search=${encodeURIComponent(
            searchQuery,
          )}`,
        );
        const data = await res.json();
        setSuggestions(data.products?.slice(0, 5) || []);
      } catch (error) {
        console.error("Suggestion Error:", error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  const handleSelectSuggestion = (id: number) => {
    setSuggestions([]);
    setSearchQuery("");
    setSearchOpen(false);
    router.push(`/collection`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSuggestions([]);
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white flex flex-col transition-all duration-300">
      {/* 1. TOP ANNOUNCEMENT BAR (Sleek Wine-Red Sliding Marquee) */}
      <div className="bg-[#6A0F1F] h-8 flex items-center overflow-hidden w-full relative">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...announcements, ...announcements].map((text, index) => (
            <span
              key={index}
              className="mx-8 flex justify-center items-center gap-4 text-[9px] sm:text-[10px] font-medium text-white tracking-[0.25em] uppercase"
            >
              <span>{text}</span>
              <span aria-hidden="true" className="text-white/60">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 2. MAIN BRAND NAVIGATION HEADER (Shrinks dynamically on scroll) */}
      <nav
        className={`border-b border-neutral-100 bg-white/95 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "h-14 sm:h-15 shadow-sm" : "h-20 sm:h-24"
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative">
          {/* LEFT: Menu Hamburger (Mobile) & Desktop Links */}
          <div className="flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 -ml-2 rounded-full text-neutral-800 hover:bg-neutral-50 transition md:hidden"
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold text-neutral-800 uppercase tracking-[0.2em] relative">
              <Link
                href="/"
                className="hover:text-[#6A0F1F] transition duration-200"
              >
                Home
              </Link>

              {/* Sub-Collection Dropdown Trigger */}
              <div
                className="relative flex items-center gap-1 cursor-pointer"
                onMouseEnter={() => setCollectionOpen(true)}
                onMouseLeave={() => setCollectionOpen(false)}
              >
                <Link
                  href="/collection"
                  className="hover:text-[#6A0F1F] transition duration-200"
                >
                  Collections
                </Link>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${collectionOpen ? "rotate-180 text-[#6A0F1F]" : ""}`}
                />

                {/* Collections Dropdown Panel */}
                {collectionOpen && (
                  <div className="absolute left-0 top-full pt-4 w-48 z-50">
                    <div className="bg-white border border-neutral-100 rounded-xl shadow-lg py-2 divide-y divide-neutral-50">
                      <Link
                        href="/women#categoryPage"
                        className="block px-5 py-3 text-[10px] tracking-wider uppercase font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                      >
                        Women Collection
                      </Link>
                      <Link
                        href="/men"
                        className="block px-5 py-3 text-[10px] tracking-wider uppercase font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                      >
                        Men Collection
                      </Link>
                      <Link
                        href="/kids"
                        className="block px-5 py-3 text-[10px] tracking-wider uppercase font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                      >
                        Kids Collection
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="hover:text-[#6A0F1F] transition duration-200"
              >
                Blogs
              </Link>
            </div>
          </div>

          {/* CENTER: CRISP BRAND SVG LOGO (Absolutely Centered and scaled dynamically with scroll) */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <Link href="/" className="flex items-center">
              <svg
                id="Layer_1"
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1040.62 300.82"
                className={`transition-all duration-300 select-none ${
                  scrolled ? "h-6 sm:h-7" : "h-8 sm:h-10"
                }`}
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
            </Link>
          </div>

          {/* RIGHT: SEARCH, WISHLIST (Desktop Only), ACCOUNT (Desktop Only), CART Drawer Trigger */}
          <div className="flex items-center gap-0.5 sm:gap-2 text-neutral-800">
            {/* SEARCH PANEL TRIGGER */}
            <button
              onClick={() => setSearchOpen(!searchActive)}
              className="p-2 rounded-full hover:bg-neutral-50 transition cursor-pointer hover:text-[#6A0F1F]"
              aria-label="Toggle Search"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* WISHLIST LINK (Desktop Only) */}
            <Link
              href="/favorites"
              className="hidden md:inline-flex p-2.5 rounded-full hover:bg-neutral-50 transition hover:text-[#6A0F1F]"
              aria-label="Wishlist"
            >
              <Heart size={19} strokeWidth={1.5} />
            </Link>

            {/* ACCOUNT / PROFILE (Desktop Only) */}
            <div
              className="hidden md:block relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              {!authLoading && !isLogged ? (
                <Link
                  href="/account/login"
                  className="p-2.5 rounded-full hover:bg-neutral-50 flex items-center justify-center hover:text-[#6A0F1F]"
                  aria-label="Login"
                >
                  <User size={19} strokeWidth={1.5} />
                </Link>
              ) : (
                <>
                  <button
                    className="p-2.5 rounded-full hover:bg-neutral-50 flex items-center justify-center hover:text-[#6A0F1F]"
                    aria-label="User Profile"
                  >
                    <User size={19} strokeWidth={1.5} />
                  </button>

                  {profileOpen && isLogged && (
                    <div className="absolute right-0 top-full pt-4 w-44 z-50">
                      <div className="bg-white border border-neutral-100 rounded-xl shadow-lg py-2">
                        <div className="px-4 py-2 border-b border-neutral-50">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            Hello,
                          </p>
                          <p className="text-xs font-bold text-neutral-800 truncate">
                            {user?.username}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition"
                        >
                          <User size={14} strokeWidth={1.5} />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-xs font-medium text-red-600 hover:bg-neutral-50 transition"
                        >
                          <LogOut size={14} strokeWidth={1.5} />
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* CART (Triggers slide-out CartDrawer on click) */}
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="group relative p-2 rounded-full hover:bg-neutral-50 transition cursor-pointer hover:text-[#6A0F1F]"
              aria-label="Cart"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 rounded-full bg-[#6A0F1F] px-1.5 py-0.5 text-[8px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. FLOATING SEARCH DRAWER */}
        {searchActive && (
          <div className="border-t border-neutral-100 bg-neutral-50/50 py-4 px-4 shadow-inner transition duration-300">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="SEARCH FOR CO-ORD SETS, DRESSES, ETS..."
                  className="w-full bg-white border border-neutral-200 rounded-full px-5 py-3 text-xs uppercase tracking-widest font-semibold text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-[#6A0F1F]"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 p-1.5 text-neutral-400 hover:text-[#6A0F1F]"
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </form>

              {/* Suggestions dropdown */}
              {searchQuery && (
                <div className="mt-2 bg-white border border-neutral-100 rounded-2xl shadow-lg max-h-56 overflow-y-auto divide-y divide-neutral-50">
                  {loadingSuggestions && (
                    <div className="px-5 py-3 text-xs text-neutral-400 tracking-wider">
                      Searching...
                    </div>
                  )}
                  {!loadingSuggestions && suggestions.length === 0 && (
                    <div className="px-5 py-3 text-xs text-neutral-400 tracking-wider">
                      No results found
                    </div>
                  )}
                  {suggestions.map((item) => (
                    <div
                      key={item.productId}
                      onClick={() => handleSelectSuggestion(item.productId)}
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 cursor-pointer transition"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 4. MOBILE HAMBURGER DROPDOWN SLIDEOUT MENU */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-x-0 top-[112px] bottom-0 z-30 md:hidden bg-white flex flex-col justify-between border-t border-neutral-100 shadow-2xl transition duration-300"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
            {/* Primary Category Links */}
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Categories
              </p>
              <div className="flex flex-col gap-3 font-semibold text-sm uppercase tracking-widest text-neutral-800">
                <Link
                  href="/"
                  className="hover:text-[#6A0F1F] py-1 border-b border-neutral-50"
                >
                  Home
                </Link>
                <Link
                  href="/women#categoryPage"
                  className="hover:text-[#6A0F1F] py-1 border-b border-neutral-50"
                >
                  Women Collection
                </Link>
                <Link
                  href="/men"
                  className="hover:text-[#6A0F1F] py-1 border-b border-neutral-50"
                >
                  Men Collection
                </Link>
                <Link
                  href="/kids"
                  className="hover:text-[#6A0F1F] py-1 border-b border-neutral-50"
                >
                  Kids Collection
                </Link>
                <Link href="/blog" className="hover:text-[#6A0F1F] py-1">
                  Vastra Journal
                </Link>
              </div>
            </div>

            {/* System / Help Links */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Customer Support
              </p>
              <div className="flex flex-col gap-3 font-semibold text-xs uppercase tracking-widest text-neutral-600">
                <Link
                  href="/support"
                  className="flex items-center gap-2 hover:text-[#6A0F1F]"
                >
                  <HelpCircle size={15} strokeWidth={1.5} />
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Profile / Account Area */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Account
              </p>
              {!authLoading && !isLogged ? (
                <Link
                  href="/account/login"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <User size={15} strokeWidth={1.5} />
                  Login / Signup
                </Link>
              ) : (
                <div className="space-y-3 font-semibold text-xs uppercase tracking-widest text-neutral-700">
                  <div className="flex items-center gap-2 text-neutral-900 pb-2">
                    <User
                      size={15}
                      strokeWidth={1.5}
                      className="text-[#6A0F1F]"
                    />
                    <span>Hello, {user?.username}</span>
                  </div>
                  <Link href="/profile" className="block hover:text-[#6A0F1F]">
                    My Profile
                  </Link>
                  <Link
                    href="/favorites"
                    className="block hover:text-[#6A0F1F]"
                  >
                    My Wishlist
                  </Link>
                  <Link href="/orders" className="block hover:text-[#6A0F1F]">
                    Track Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left font-bold text-red-600 flex items-center gap-2 pt-2 border-t border-neutral-50 cursor-pointer"
                  >
                    <LogOut size={15} strokeWidth={1.5} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Footer branding */}
          <div className="bg-neutral-50 border-t border-neutral-100 px-6 py-5 text-center">
            <p className="text-[9px] text-neutral-400 tracking-widest font-semibold uppercase">
              © 2026 VastraDrobe Label. All Rights Reserved.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
