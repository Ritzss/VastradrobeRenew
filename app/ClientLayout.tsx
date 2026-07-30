"use client";

import { ReactNode, useEffect, useState } from "react";
import { AppProvider } from "./context/contextProvider";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "sonner";
import Footer from "./components/Global/Footer";
import { LayoutGroup } from "framer-motion";
import LandingLoader from "./components/Loaders/LandingLoaders";
import WhatsAppButton from "./components/Global/WhatsappButton";
import { WhatsAppProvider } from "./context/WhatsAppContext";
import CartDrawer from "./components/Global/CartDrawer";
import { useAppContext } from "@/hooks/useAppContext";

// 🎬 Sync loading state with AppContext to coordinate animations globally after loader fades out
const LoaderStateSync = ({ loading }: { loading: boolean }) => {
  const { setIsLoaderFinished } = useAppContext();

  useEffect(() => {
    if (!loading) {
      // 1050ms matches the exit transition duration + delay of LandingLoader
      const timer = setTimeout(() => {
        setIsLoaderFinished(true);
      }, 1050);
      return () => clearTimeout(timer);
    } else {
      setIsLoaderFinished(false);
    }
  }, [loading, setIsLoaderFinished]);

  return null;
};

const ClientLayout = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const load = async () => {
      await document.fonts.ready;

      // 👑 LUXURY PACING: Increased loading time to 2.8 seconds (2800ms)
      // This allows the premium organic breathe animation of the SVG logo to complete a full
      // cycle and builds a strong, high-end brand connection with the user before the curtain opens.
      setTimeout(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      }, 2800);
    };

    load();
  }, []);

  return (
    <AppProvider>
      <LoaderStateSync loading={loading} />
      <WhatsAppProvider>
        <WhatsAppButton />

        <CartDrawer />
        <Toaster position="bottom-left" richColors />
        <LayoutGroup>
          <LandingLoader loading={loading} />

          {/* 🔒 FIXED ALL-PAGES DARK MODE: Added 'dark:bg-black' to the scroll wrapper container 
              and main area. Toggling dark mode now instantly applies across 100% of your pages!
          */}
          <div
            className={`max-h-screen overflow-y-scroll scrollbar-hide bg-[#fcfbfa] dark:bg-black transition-colors duration-350 ${
              loading ? "pointer-events-none" : ""
            }`}
          >
            {/* Navbar (fixed at top of screen) */}
            <Navbar />

            {/* MAIN CONTENT AREA */}
            <main className="min-h-screen pt-[104px] sm:pt-[112px] bg-[#fcfbfa] dark:bg-black transition-colors duration-350">
              {children}
            </main>

            <Footer />
          </div>
        </LayoutGroup>
      </WhatsAppProvider>
    </AppProvider>
  );
};

export default ClientLayout;
