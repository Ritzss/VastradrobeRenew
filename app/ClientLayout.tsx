"use client";

import { ReactNode, useEffect } from "react";
import { AppProvider } from "./context/contextProvider";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "sonner";
import Footer from "./components/Global/Footer";

const ClientLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <AppProvider>
      <Toaster position="top-right" richColors />

      {/* Sticky navbar must be OUTSIDE scroll containers */}
      <header className="fixed top-0 left-0 w-full z-50 h-[14vh] transition-all duration-1000">
        <Navbar />
      </header>

      <main className="min-h-screen mt-16">
        {children}
      </main>

      <Footer className=""/>
    </AppProvider>
  );
};

export default ClientLayout;
