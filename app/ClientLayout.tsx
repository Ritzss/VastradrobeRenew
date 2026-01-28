"use client";

import { ReactNode, useEffect } from "react";
import { AppProvider } from "./context/contextProvider";
import Navbar from "./components/navbar/navbar";
import { Toaster } from "sonner";
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
        <Navbar products={[]} />
      </div>
      <div className="m-1 min-h-screen">{children}</div>
    </AppProvider>
  );
};

export default ClientLayout;
