"use client";

import { useEffect } from "react";
import { useWhatsApp } from "@/context/WhatsAppContext";

interface Props {
  message: string;
}

export default function WhatsAppPageMessage({
  message,
}: Props) {
  const { setMessage } = useWhatsApp();

  useEffect(() => {
    setMessage(message);
  }, [message, setMessage]);

  return null;
}