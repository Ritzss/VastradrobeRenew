/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/UI/Logo";

/**
 * 👑 LUXURY REDESIGN: Navbar (Nangalia Ruchira Theme)
 *
 * Advanced Features Implemented:
 * - 🌗 Full dark-mode support styling (using class-based selectors with Tailwind v4).
 * - ⚡ INTERACTIVE SHRINKING HEADER:
 *   * When scrolled down, the header shrinks to h-14/15.
 *   * If you hover over the shrunk header, OR scroll back up, it expands back smoothly to h-20/24!
 * - 🌀 Sliding marquee announcements inside the wine-red top bar.
 * - 📱 Overlap-proof mobile responsiveness.
 * - 🎬 Entrance Animations: Slow-easing entrance animations on logo, links, icons, and mobile panels.
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
  const [isHovered, setIsHovered] = useState(false); // Track header hover state
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
    isLoaderFinished,
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

  // Determine active shrinking state
  // ⚡ The header contracts ONLY when scrolled down AND the user is NOT hovering their mouse over it!
  const isShrunk = scrolled && !isHovered;

  return (
    <header
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed top-0 inset-x-0 z-40 bg-white dark:bg-black flex flex-col transition-all duration-300"
    >
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

      {/* 2. MAIN BRAND NAVIGATION HEADER (Shrinks dynamically on scroll / expands back on hover + fully Dark-Mode styled) */}
      <nav
        className={`border-b border-neutral-100 dark:border-neutral-900 bg-white/95 dark:bg-black/95 backdrop-blur-md transition-all duration-300 ${
          isShrunk ? "h-14 sm:h-15 shadow-sm" : "h-18 sm:h-20"
        }`}
        aria-label="Main Navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative">
          {/* LEFT: Menu Hamburger (Mobile) & Desktop Links (Animate entrance) */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={
              isLoaderFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="flex items-center"
          >
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 -ml-2 rounded-full text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition md:hidden"
              aria-label="Toggle Menu"
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 uppercase tracking-[0.2em] relative">
              <Link
                href="/"
                className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition duration-200"
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
                  className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition duration-200"
                >
                  Collections
                </Link>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${collectionOpen ? "rotate-180 text-[#6A0F1F] dark:text-[#e4e198]" : ""}`}
                />

                {/* Collections Dropdown Panel (Mega Dropdown with Overlaid Hero Cards for Desktop) */}
                {collectionOpen && (
                  <div className="absolute left-[-150px] top-full pt-4 w-[600px] lg:w-[680px] z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl shadow-md p-5 grid grid-cols-3 gap-5">
                      {/* Column 1: Women */}
                      <Link
                        href="/women#categoryPage"
                        className="group relative h-48 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100/50 dark:border-neutral-900 shadow-md"
                      >
                        <img
                          src="/Assets/Images/Hero/womenHero.jpeg"
                          alt="Women Collection"
                          className="object-cover w-full h-full object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          draggable="false"
                        />
                        {/* Premium dark gradient overlay for typography readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-all duration-300 group-hover:from-black/90" />

                        {/* Text Overlay (Bottom Aligned) */}
                        <div className="absolute bottom-4 left-4 right-4 text-left text-white space-y-0.5">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white group-hover:text-[#e4e198] transition duration-200">
                            Women Collection
                          </h4>
                          <p className="text-[8px] text-white/70 font-light uppercase tracking-widest">
                            Elegant co-ords & sets
                          </p>
                        </div>
                      </Link>

                      {/* Column 2: Men */}
                      <Link
                        href="/men"
                        className="group relative h-48 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100/50 dark:border-neutral-900 shadow-md"
                      >
                        <img
                          src="/Assets/Images/Hero/menHero.jpeg"
                          alt="Men Collection"
                          className="object-cover w-full h-full object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          draggable="false"
                        />
                        {/* Premium dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-all duration-300 group-hover:from-black/90" />

                        {/* Text Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 text-left text-white space-y-0.5">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white group-hover:text-[#e4e198] transition duration-200">
                            Men Collection
                          </h4>
                          <p className="text-[8px] text-white/70 font-light uppercase tracking-widest">
                            Modern classic styles
                          </p>
                        </div>
                      </Link>

                      {/* Column 3: Kids */}
                      <Link
                        href="/kids"
                        className="group relative h-48 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100/50 dark:border-neutral-900 shadow-md"
                      >
                        <img
                          src="/Assets/Images/Hero/childrenHero.jpg"
                          alt="Kids Collection"
                          className="object-cover w-full h-full object-top transition-transform duration-700 ease-out group-hover:scale-105"
                          draggable="false"
                        />
                        {/* Premium dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-all duration-300 group-hover:from-black/90" />

                        {/* Text Overlay */}
                        <div className="absolute bottom-4 left-4 right-4 text-left text-white space-y-0.5">
                          <h4 className="text-[10px] font-bold uppercase tracking-[0.25em] text-white group-hover:text-[#e4e198] transition duration-200">
                            Kids Collection
                          </h4>
                          <p className="text-[8px] text-white/70 font-light uppercase tracking-widest">
                            Playful daily wear
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition duration-200"
              >
                Blogs
              </Link>
            </div>
          </motion.div>

          {/* CENTER: BRAND LOGO (Absolutely Centered, scales with scroll / hover, enters with elegant scale-blur reveal) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -15 }}
            animate={
              isLoaderFinished
                ? { opacity: 1, scale: 1, y: 0 }
                : { opacity: 0, scale: 0.9, y: -15 }
            }
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto"
          >
            <Link href="/" className="flex items-center">
              <div
                className={`relative transition-all duration-300 ${
                  isShrunk
                    ? "w-28 h-8 sm:w-32 sm:h-9"
                    : "w-36 h-10 sm:w-44 sm:h-12"
                }`}
              >
                <Logo className="w-full h-full object-contain" />
              </div>
            </Link>
          </motion.div>

          {/* RIGHT: SEARCH, WISHLIST (Desktop Only), ACCOUNT (Desktop Only), CART Drawer Trigger (Animate entrance) */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={
              isLoaderFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }
            }
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="flex items-center gap-0.5 sm:gap-2 text-neutral-800 dark:text-neutral-200"
          >
            {/* SEARCH PANEL TRIGGER */}
            <button
              onClick={() => setSearchOpen(!searchActive)}
              className="p-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
              aria-label="Toggle Search"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>

            {/* WISHLIST LINK (Desktop Only) */}
            <Link
              href="/favorites"
              className="hidden md:inline-flex p-2.5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
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
                  className="p-2.5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center justify-center hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                  aria-label="Login"
                >
                  <User size={19} strokeWidth={1.5} />
                </Link>
              ) : (
                <>
                  <button
                    className="p-2.5 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 flex items-center justify-center hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                    aria-label="User Profile"
                  >
                    <User size={19} strokeWidth={1.5} />
                  </button>

                  {profileOpen && isLogged && (
                    <div className="absolute right-0 top-full pt-4 w-44 z-50">
                      <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-xl shadow-lg py-2">
                        <div className="px-4 py-2 border-b border-neutral-50 dark:border-neutral-900">
                          <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                            Hello,
                          </p>
                          <p className="text-xs font-bold text-neutral-800 dark:text-white truncate">
                            {user?.username}
                          </p>
                        </div>
                        <Link
                          href="/profile"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] transition"
                        >
                          <User size={14} strokeWidth={1.5} />
                          My Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 cursor-pointer text-xs font-medium text-red-600 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
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

            {/* CART (Triggers slide-out CartDrawer on click with beautiful pop/jump animation on cart count changes) */}
            <motion.button
              onClick={() => setCartDrawerOpen(true)}
              animate={{
                scale: [1, 1.25, 0.95, 1.1, 1],
                y: [0, -6, 1, -0.5, 0],
              }}
              key={cartCount}
              transition={{
                duration: 0.45,
                ease: "easeInOut",
              }}
              className="group relative p-2 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-900 transition cursor-pointer hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
              aria-label="Cart"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 rounded-full bg-[#6A0F1F] px-1.5 py-0.5 text-[8px] font-bold text-white leading-none">
                  {cartCount}
                </span>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* 3. FLOATING SEARCH DRAWER */}
        {searchActive && (
          <div className="border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-950 py-4 px-4 shadow-inner transition duration-300">
            <div className="max-w-3xl mx-auto">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="SEARCH FOR CO-ORD SETS, DRESSES, ETS..."
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full px-5 py-3 text-xs uppercase tracking-widest font-semibold text-neutral-800 dark:text-neutral-200 placeholder:text-neutral-400 focus:outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] shadow-xs"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-4 p-1.5 text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </form>

              {/* Suggestions dropdown */}
              {searchQuery && (
                <div className="mt-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-lg max-h-56 overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-850">
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
                      className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] cursor-pointer transition"
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

      {/* 4. MOBILE HAMBURGER DROPDOWN SLIDEOUT MENU (Animate Slideout Panel) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="absolute inset-x-0 top-full h-[calc(100vh-100%)] z-30 md:hidden bg-white dark:bg-black flex flex-col justify-between border-t border-neutral-100 dark:border-neutral-900 shadow-lg overflow-y-auto"
          >
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
              {/* Primary Category Links */}
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                  Categories
                </p>
                <div className="flex flex-col gap-3 font-semibold text-sm uppercase tracking-widest text-neutral-800 dark:text-neutral-200">
                  <Link
                    href="/"
                    className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] py-1 border-b border-neutral-50 dark:border-neutral-900"
                  >
                    Home
                  </Link>
                  <Link
                    href="/women#categoryPage"
                    className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] py-1 border-b border-neutral-50 dark:border-neutral-900"
                  >
                    Women Collection
                  </Link>
                  <Link
                    href="/men"
                    className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] py-1 border-b border-neutral-50 dark:border-neutral-900"
                  >
                    Men Collection
                  </Link>
                  <Link
                    href="/kids"
                    className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] py-1 border-b border-neutral-50 dark:border-neutral-900"
                  >
                    Kids Collection
                  </Link>
                  <Link
                    href="/blog"
                    className="hover:text-[#6A0F1F] dark:hover:text-[#e4e198] py-1"
                  >
                    Vastra Journal
                  </Link>
                </div>
              </div>

              {/* System / Help Links */}
              <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                  Customer Support
                </p>
                <div className="flex flex-col gap-3 font-semibold text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                  <Link
                    href="/support"
                    className="flex items-center gap-2 hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                  >
                    <HelpCircle size={15} strokeWidth={1.5} />
                    Contact Support
                  </Link>
                </div>
              </div>

              {/* Profile / Account Area */}
              <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-900">
                <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                  Account
                </p>
                {!authLoading && !isLogged ? (
                  <Link
                    href="/account/login"
                    className="flex items-center gap-2 py-1 font-semibold text-xs uppercase tracking-widest text-neutral-700 dark:text-neutral-300 hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                  >
                    <User size={15} strokeWidth={1.5} />
                    Login / Signup
                  </Link>
                ) : (
                  <div className="space-y-3 font-semibold text-xs uppercase tracking-widest text-neutral-700 dark:text-neutral-300">
                    <div className="flex items-center gap-2 text-neutral-900 dark:text-white pb-2 border-b border-neutral-50 dark:border-neutral-900">
                      <User
                        size={15}
                        strokeWidth={1.5}
                        className="text-[#6A0F1F] dark:text-[#e4e198]"
                      />
                      <span>Hello, {user?.username}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="block hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/favorites"
                      className="block hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                    >
                      My Wishlist
                    </Link>
                    <Link
                      href="/orders"
                      className="block hover:text-[#6A0F1F] dark:hover:text-[#e4e198]"
                    >
                      Track Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left font-bold text-red-600 flex items-center gap-2 pt-2 border-t border-neutral-50 dark:border-neutral-900 cursor-pointer"
                    >
                      <LogOut size={15} strokeWidth={1.5} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 🔒 FIXED MOBILE FOOTER: Added 'dark:bg-neutral-950' and 'dark:border-neutral-900' 
                so that the footer branding bar correctly transitions in dark mode!
            */}
            <div className="bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900 px-6 py-5 text-center transition-colors">
              <p className="text-[9px] text-neutral-400 dark:text-neutral-500 tracking-widest font-semibold uppercase">
                © 2026 VastraDrobe Label. All Rights Reserved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
