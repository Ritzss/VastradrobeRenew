/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { IoSearch, IoCart } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa6";
import { MdSupportAgent } from "react-icons/md";
import { RiAccountBoxFill, RiAccountBoxLine } from "react-icons/ri";
import { Dock, Home, LogOut, Menu, ShoppingBag, X } from "lucide-react";

import { useAppContext } from "@/hooks/useAppContext";
import { FaRegListAlt } from "react-icons/fa";
// import TypingEffect from "../UI/TypingEffect";
import { IoIosArrowDown } from "react-icons/io";
import RotatingText from "../UI/RotatingText";

/**
 * Fixes applied:
 * - consistent pill corners using rounded-full
 * - reliable dropdown open state (mouse + focus) so it doesn't close while interacting
 * - input + rotating placeholder vertically aligned
 *
 * UI-only tweaks — core logic (fetch, router, handlers) preserved.
 */

const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(true);
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // <-- small UI state to keep dropdown open while interacting
  const menuRef = useRef<HTMLDivElement>(null);

  const searchItems = [
    "Pants",
    "Tops",
    "Sandals",
    "Jackets",
    "Pants",
    "Tops",
    "Sandals",
    "Jackets",
  ];

  const {
    user,
    authLoading,
    cartCount,
    searchQuery,
    setSearchQuery,
    handleLogout,
  } = useAppContext();

  const isLogged = !!user;

  const [value, setValue] = useState(searchQuery);
  const [profileOpen, setProfileOpen] = useState(false);
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

  /* 🔍 FETCH SEARCH SUGGESTIONS (DEBOUNCED) */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoadingSuggestions(true);

        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`,
        );

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setSuggestions(data || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  const handleSelectSuggestion = (id: string) => {
    setSuggestions([]);
    setSearchQuery("");
    router.push(`/product/${id}`);
  };

  return (
    // Make NAV pill slightly elevated and pill-shaped
    <nav aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="w-full rounded-full p-3 flex items-center gap-6 shadow-[0_10px_25px_rgba(149,127,106,0.08)]"
          style={{
            background: "#f5f1e7",
            border: "1px solid rgba(0,0,0,0.04)",
            backdropFilter: "blur(6px)",
          }}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="relative nav-logo h-13 w-24 mx-4 rounded-full shrink-0 overflow-hidden flex items-center"
          >
            <Image
              src="/Assets/Images/Logo2.png"
              fill
              sizes="(max-width: 768px) 120px, 160px"
              alt="Vastradrobe"
              className=""
              priority
            />
          </Link>

          {/* NAV LINKS (desktop) */}
          <div className="hidden md:flex flex-1 items-center gap-3 text-sm font-medium text-[#957f6a]">
            <Link href="/" className="hover:text-[#6a0f1f]">
              Home
            </Link>

            {/* COLLECTION with improved open behaviour */}
            <div
              className="relative"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                href="/product"
                className="flex items-center gap-2 hover:text-[#6a0f1f]"
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Our Collection
                <IoIosArrowDown
                  size={16}
                  className={`transform transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </Link>

              {showCategoryDropdown && dropdownOpen && (
                <div className="absolute left-0 top-full pt-5 z-50">
                  {/* Arrow */}
                  <div className="absolute left-10 top-3 w-5 h-5 bg-white rotate-45"></div>

                  <div className="w-[820px] rounded-[48px] p-5 bg-white">
                    <div className="grid grid-cols-3 gap-6">
                      {/* WOMEN */}
                      <Link
                        href="/women"
                        className="flex flex-col items-center text-center group"
                      >
                        <div className="relative w-full h-[140px] rounded-4xl overflow-hidden">
                          <Image
                            src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1770977218/products/ocktsxwyzhi2rzwoantd.jpg"
                            alt="Women's Co-ords"
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <span className="mt-3 text-[14px] font-medium text-[#5f5143]">
                          Women&apos;s Co-ords
                        </span>
                      </Link>

                      {/* MEN */}
                      <Link
                        href="/men"
                        className="flex flex-col items-center text-center group"
                      >
                        <div className="relative w-full h-[140px] rounded-4xl overflow-hidden">
                          <Image
                            src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1771238559/products/miaelyvxljqatr8prk9v.jpg"
                            alt="Men's Linen Essentials"
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <span className="mt-3 text-[14px] font-medium text-[#5f5143]">
                          Men&apos;s Linen Essentials
                        </span>
                      </Link>

                      {/* KIDS */}
                      <Link
                        href="/kids"
                        className="flex flex-col items-center text-center group"
                      >
                        <div className="relative w-full h-[140px] rounded-4xl overflow-hidden">
                          <Image
                            src="https://res.cloudinary.com/dwhn5ec09/image/upload/v1770292098/products/uiyy3o3gztwnx5et7oiy.jpg"
                            alt="Kids' Comfort Wear"
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <span className="mt-3 text-[14px] font-medium text-[#5f5143]">
                          Kid&apos;s Comfort Wear
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/blog" className="hover:text-[#6a0f1f]">
              Blog
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4 ml-auto">
            {/* SEARCH on Desktop */}
            <div
              className="hidden lg:block relative rounded-full overflow-visible"
              style={{ width: "360px" }}
            >
              <div
                className="flex items-center rounded-full px-3 py-2"
                style={{
                  background: "#ffffff",
                  boxShadow:
                    "inset 0 2px 6px rgba(0,0,0,0.04), 0 6px 18px rgba(149,127,106,0.06)",
                }}
              >
                <IoSearch className="text-[#957f6a]" />
                {/* wrapper is flex so icon + input + rotating text align vertically */}
                <div className="relative flex-1 ml-3 flex items-center">
                  <input
                    className="w-full bg-transparent outline-none text-sm placeholder:text-[#b99f84] leading-5"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value);
                      setSearchQuery(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && value.trim()) {
                        setSuggestions([]);
                        router.push(`/search?q=${encodeURIComponent(value)}`);
                      }
                    }}
                    aria-label="Search products"
                    style={{ paddingTop: 2, paddingBottom: 2 }}
                  />

                  {/* rotating placeholder aligned vertically with input */}
                  {!value && (
                    <div
                      className="pointer-events-none absolute left-0 ml-0 flex items-center gap-1 top-1/2 -translate-y-1/2 text-sm"
                      style={{ color: "#b99f84" }}
                    >
                      <span className="text-[#b99f84]">Search</span>
                      <RotatingText
                        texts={searchItems}
                        mainClassName="inline-block text-sm text-[#c0a38a] overflow-hidden leading-5"
                        staggerFrom={"last"}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-120%" }}
                        staggerDuration={0.025}
                        splitLevelClassName="overflow-hidden"
                        transition={{
                          type: "spring",
                          damping: 30,
                          stiffness: 400,
                        }}
                        rotationInterval={2400}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* SUGGESTIONS */}
              {searchQuery && (
                <div className="absolute left-0 right-0 mt-3 bg-white border rounded-xl shadow-sm z-50 max-h-72 overflow-auto">
                  {loadingSuggestions && (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      Searching…
                    </div>
                  )}

                  {!loadingSuggestions && suggestions.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-400">
                      No results found
                    </div>
                  )}

                  {suggestions.map((item) => (
                    <div
                      key={item.productId}
                      onClick={() => handleSelectSuggestion(item.productId)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-50"
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CART */}
            <Link
              href="/cart"
              className="relative text-[#957f6a] hover:text-[#6a0f1f]"
            >
              <IoCart size={21} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-2 text-xs text-white rounded-full px-1.5"
                  style={{ background: "#957f6a" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {/* DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center relative">
              {!authLoading && !isLogged && (
                <Link
                  href="/account/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-[#5f5143] bg-white hover:bg-[#e9e1d4] transition"
                >
                  <RiAccountBoxLine size={18} />
                  Login
                </Link>
              )}

              {isLogged && (
                <div
                  className="relative"
                  onMouseEnter={() => setProfileOpen(true)}
                  onMouseLeave={() => setProfileOpen(false)}
                >
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#5f5143] text-sm font-medium shadow-sm hover:bg-[#e9e1d4] transition">
                    <RiAccountBoxLine size={18} />
                    <span className="max-w-[110px] truncate">
                      {user?.username}
                    </span>
                    <IoIosArrowDown size={14} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full pt-3 z-50">
                      {/* Arrow */}
                      <div className="absolute right-6 top-2 w-4 h-4 bg-white rotate-45 border-black/5"></div>

                      <div className="relative w-44 rounded-2xl overflow-hidden bg-white">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 p-5 text-sm text-[#5f5143] hover:bg-[#e9e1d4] transition"
                        >
                          <RiAccountBoxLine size={16} />
                          Profile
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 p-5 cursor-pointer text-sm text-[#9a4b4b] hover:bg-[#e9e1d4] transition"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ------------------------------------------------Mobile Hamburger------------------------------------------------ */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e9e1d4] transition"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X size={22} strokeWidth={2} className="text-[#957f6a]" />
              ) : (
                <Menu size={22} strokeWidth={2} className="text-[#957f6a]" />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE MENU (rounded elevated panel) */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="fixed inset-x-4 top-24 z-50 md:hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="rounded-[28px] p-5 space-y-6 shadow-[0_30px_80px_rgba(149,127,106,0.18)]"
              style={{ background: "#f5f1e7" }}
            >
              {/* SEARCH */}
              <div>
                <div
                  className="flex items-center gap-3 rounded-full px-4 py-3"
                  style={{
                    background: "#ffffff",
                    boxShadow: "inset 0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <IoSearch className="text-[#957f6a]" size={18} />
                  <input
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#b99f84]"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim()) {
                        setSuggestions([]);
                        router.push(
                          `/search?q=${encodeURIComponent(searchQuery)}`,
                        );
                      }
                    }}
                  />
                </div>
              </div>

              {/* PRIMARY LINKS */}
              <div className="rounded-2xl overflow-hidden bg-white divide-y divide-black/5">
                <Link
                  href="/"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <Home size={18} />
                  <span className="text-sm font-medium">Home</span>
                </Link>

                <button
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center justify-between px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <div className="flex items-center gap-4">
                    <ShoppingBag size={18} />
                    <span className="text-sm font-medium">Collection</span>
                  </div>
                  <IoIosArrowDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="bg-[#faf7f2]">
                    <Link
                      href="/women"
                      onClick={() => setOpen(false)}
                      className="block px-12 py-3 text-sm text-[#957f6a] hover:bg-[#e9e1d4]"
                    >
                      Women
                    </Link>
                    <Link
                      href="/men"
                      onClick={() => setOpen(false)}
                      className="block px-12 py-3 text-sm text-[#957f6a] hover:bg-[#e9e1d4]"
                    >
                      Men
                    </Link>
                    <Link
                      href="/kids"
                      onClick={() => setOpen(false)}
                      className="block px-12 py-3 text-sm text-[#957f6a] hover:bg-[#e9e1d4]"
                    >
                      Kids
                    </Link>
                  </div>
                )}

                <Link
                  href="/blog"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <Dock size={18} />
                  <span className="text-sm font-medium">Blog</span>
                </Link>

                <Link
                  href="/support"
                  className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                >
                  <MdSupportAgent size={18} />
                  <span className="text-sm font-medium">Contact Support</span>
                </Link>
              </div>

              {/* ACCOUNT SECTION */}
              <div className="rounded-2xl overflow-hidden bg-white divide-y divide-black/5">
                {!authLoading && !isLogged && (
                  <Link
                    href="/account/login"
                    className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                  >
                    <RiAccountBoxLine size={18} />
                    <span className="text-sm font-medium">
                      Login / Register
                    </span>
                  </Link>
                )}

                {isLogged && (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                    >
                      <RiAccountBoxFill size={18} />
                      <span className="text-sm font-medium">
                        {user?.username}
                      </span>
                    </Link>

                    <Link
                      href="/favorites"
                      className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                    >
                      <FaRegHeart size={18} />
                      <span className="text-sm font-medium">Favorites</span>
                    </Link>

                    <Link
                      href="/orders"
                      className="flex items-center gap-4 px-5 py-4 text-[#5f5143] hover:bg-[#e9e1d4] transition"
                    >
                      <FaRegListAlt size={18} />
                      <span className="text-sm font-medium">Orders</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-4 px-5 py-4 text-[#9a4b4b] hover:bg-[#e9e1d4] transition"
                    >
                      <LogOut size={18} />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
