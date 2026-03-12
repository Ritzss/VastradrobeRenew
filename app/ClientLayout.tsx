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
      <header className="sticky top-4 left-0 w-full z-50 transition-all duration-1000 h-0">
        <Navbar />
      </header>

      <main className="min-h-[85vh]">{children}</main>

      <Footer />
    </AppProvider>
  );
};

export default ClientLayout;
