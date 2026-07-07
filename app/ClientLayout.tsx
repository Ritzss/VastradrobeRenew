"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppProvider } from "./context/contextProvider";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "sonner";
import Footer from "./components/Global/Footer";
import { LayoutGroup } from "framer-motion";
import LandingLoader from "./components/Loaders/LandingLoaders";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const load = async () => {
      await document.fonts.ready;

      setTimeout(() => {
        requestAnimationFrame(() => {
        setLoading(false);
    });
      }, 1800);
    };

    load();
  }, []);

  const announcements = [
    "Where Elegance Meets Everyday Wear",
    "Crafted for the Modern Woman",
    "Premium Fabrics. Timeless Style.",
    "Style That Speaks Without Words",
    "Designed to Elevate Every Moment",
    "Minimal Design. Maximum Elegance.",
    "Thoughtfully Crafted. Beautifully Worn.",
    "Inspired by Contemporary Fashion",
    "Luxury You Can Live In",
    "Refined Fashion for Every Occasion",
    "Every Detail, Designed with Care",
    "Fashion That Moves With You",
    "Discover Your Signature Style",
    "Wear Confidence Every Day",
    "Effortless Dressing Starts Here",
    "Made for Moments That Matter",
    "Designed with Love in India",
    "Contemporary Fashion, Timeless Appeal",
    "Because Style Is Personal",
    "Elevate Your Everyday Wardrobe",
    "Where Comfort Finds Elegance",
    "Quality That Speaks for Itself",
    "Crafted to Be Loved for Years",
    "Elegant Essentials for Every Season",
    "Curated Pieces You'll Reach For Again",
    "Soft Fabrics. Beautiful Fits.",
    "Fashion with Purpose",
    "Less Trend. More Timeless.",
    "Premium Quality Without Compromise",
    "Style Beyond Seasons",
    "Complimentary Shipping Above ₹999",
    "Easy 15-Day Returns",
    "Secure Shopping Experience",
    "New Arrivals Every Week",
  ];

  return (
    <AppProvider>
      <Toaster position="top-right" richColors />
      <LayoutGroup>
        <LandingLoader loading={loading} />
        <div
          className={`max-h-screen overflow-y-scroll scrollbar-hide ${
            loading ? "pointer-events-none" : ""
          }`}
        >
          <section
            aria-label="Store announcements"
            className="overflow-hidden bg-linear-to-r from-[#7a2a2a] via-[#db4237] to-[#ff0000] text-[#ffffff] border-b border-[#7B6A58]"
            // className="overflow-hidden bg-[#5F5143] text-[#F8F5F1] border-b border-[#6f5f4f]"
          >
            <div className="flex w-max animate-marquee whitespace-nowrap py-2">
              {[...announcements, ...announcements].map((text, index) => (
                <span
                  key={index}
                  className="mx-8 flex justify-center items-center gap-15 text-[8px] font-light uppercase tracking-[0.18em]"
                >
                  <span>{text}</span>
                  <span aria-hidden="true" className="text-[#ffffff]">
                    ✦
                  </span>
                </span>
              ))}
            </div>
          </section>
          <header className="sticky top-0 left-0 w-full z-50 transition-all duration-1000 h-0">
            {/* Announcement Bar */}
            <Navbar />
          </header>

          <main className="min-h-screen mt-18">{children}</main>

          <Footer />
        </div>
      </LayoutGroup>
    </AppProvider>
  );
};

export default ClientLayout;
