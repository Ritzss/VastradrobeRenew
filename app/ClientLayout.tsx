"use client";

import { ReactNode, useEffect } from "react";
import { AppProvider } from "./context/contextProvider";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "sonner";
import Footer from "./components/Global/Footer";
// import { useAppContext } from "./hooks/useAppContext";

const ClientLayout = ({ children }: { children: ReactNode }) => {

  // const {products} = useAppContext();

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);
  return (
    <AppProvider>
      <Toaster position="top-right" richColors/>
      <div className="">
        <Navbar />
      </div>
      <div className="min-h-screen">{children}</div>
      <div><Footer className=""/></div>
    </AppProvider>
  );
};

export default ClientLayout;
