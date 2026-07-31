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
      }, 180);
    };

    load();
  }, []);

  return (
    <AppProvider>
      <WhatsAppProvider>
        <WhatsAppButton />

        <CartDrawer />
        <Toaster position="bottom-left" richColors />
        <LayoutGroup>
          <LandingLoader loading={loading} />

          <div
            className={`max-h-screen overflow-y-scroll scrollbar-hide bg-[#fcfbfa] ${
              loading ? "pointer-events-none" : ""
            }`}
          >
            {/* 👑 LUXURY HEADER WRAPPER (Glides sticky on scroll, including our beautiful built-in wine Announcement Bar) */}
            <header className="sticky top-0 left-0 w-full z-40 bg-white">
              <Navbar />
            </header>

            {/* MAIN CONTENT AREA: Spacious padding dynamically sized to offset our new grand taller header */}
            <main className="min-h-screen pt-31 sm:pt-35 bg-[#fcfbfa]">
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
