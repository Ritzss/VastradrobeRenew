"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface WhatsAppContextType {
  message: string;
  setMessage: (message: string) => void;
}

const WhatsAppContext = createContext<WhatsAppContextType | null>(null);

export function WhatsAppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [message, setMessage] = useState(
    "Hi VastraDrobe,\n\nI have a question."
  );

  const value = useMemo(
    () => ({
      message,
      setMessage,
    }),
    [message]
  );

  return (
    <WhatsAppContext.Provider value={value}>
      {children}
    </WhatsAppContext.Provider>
  );
}

export function useWhatsApp() {
  const context = useContext(WhatsAppContext);

  if (!context)
    throw new Error(
      "useWhatsApp must be used inside WhatsAppProvider"
    );

  return context;
}