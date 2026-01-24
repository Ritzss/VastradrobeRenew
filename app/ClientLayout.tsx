"use client";

import React, { ReactNode, useEffect } from "react";
import { AppProvider } from "./context/contextProvider";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "sonner";

const ClientLayout = ({ children }: { children: ReactNode }) => {

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);
  return (
    <AppProvider>
      <Toaster position="top-right" richColors/>
      <div className="sticky top-0 z-99">
        <Navbar />
      </div>
      <div className="">{children}</div>
    </AppProvider>
  );
};

export default ClientLayout;
