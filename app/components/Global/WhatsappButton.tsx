"use client";

import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { useWhatsApp } from "@/context/WhatsAppContext";
import { createWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppButton() {
  const { message } = useWhatsApp();

  return (
    <Link
      href={createWhatsAppLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-999 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-110"
    >
      <FaWhatsapp size={30} />
    </Link>
  );
}