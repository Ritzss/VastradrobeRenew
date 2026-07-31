"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  Clock,
  MessageSquare,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function SupportPageClient() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("Message received! Our team will reach out shortly.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      setLoading(false);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#fcfbfa] dark:bg-black text-neutral-800 dark:text-neutral-200 py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 select-none">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* ================= 🏛️ HEADER (Spacious Minimal Typography) ================= */}
        <div className="text-center space-y-3">
          <p className="text-[10px] font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.25em] uppercase">
            Concierge Services
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
            Customer Support
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed">
            Questions about your order, custom sizing, returns, or shipping? Our
            dedicated concierge and support team is ready to assist you.
          </p>
        </div>

        {/* ================= 🏛️ TWO-COLUMN EDITORIAL LAYOUT ================= */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: BRAND TRUST & SUPPORT INFO GRID (Spans 5 Cols) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            {/* Quick Cards Info */}
            <div className="border border-neutral-100 dark:border-neutral-900 bg-white/50 dark:bg-neutral-950/50 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="font-serif text-lg text-neutral-800 dark:text-white uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-900 pb-3">
                Direct Contact
              </h2>

              <div className="space-y-5 text-xs font-light font-sans tracking-wide">
                {/* Support Email */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-[#6A0F1F] dark:text-[#e4e198] shrink-0">
                    <Mail size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] uppercase tracking-widest text-neutral-400">
                      Email Assistance
                    </h4>
                    <p className="mt-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      support@vastradrobe.com
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Expect a detailed response within 24 business hours.
                    </p>
                  </div>
                </div>

                {/* Hours of Operation */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-[#6A0F1F] dark:text-[#e4e198] shrink-0">
                    <Clock size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] uppercase tracking-widest text-neutral-400">
                      Hours of Service
                    </h4>
                    <p className="mt-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      Monday — Saturday
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      09:00 AM — 07:00 PM IST
                    </p>
                  </div>
                </div>

                {/* WhatsApp Help */}
                <div className="flex gap-4 items-start">
                  <div className="p-2.5 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-[#6A0F1F] dark:text-[#e4e198] shrink-0">
                    <MessageSquare size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-[9px] uppercase tracking-widest text-neutral-400">
                      WhatsApp Chatbot
                    </h4>
                    <p className="mt-1 font-semibold text-neutral-700 dark:text-neutral-300">
                      +91 99999 12345
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Quick responses on sizing, shipping, and fabric guides.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support trust points */}
            <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 dark:border-neutral-900 pt-6">
              <div className="flex flex-col items-center p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900 text-center shadow-xs">
                <ShieldCheck
                  size={18}
                  className="text-[#6A0F1F] dark:text-[#e4e198] mb-2"
                  strokeWidth={1.5}
                />
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-800 dark:text-white leading-tight">
                  100% Genuine
                </h4>
                <p className="text-[8px] text-neutral-400 mt-1 leading-normal">
                  Every apparel comes direct from our master looms
                </p>
              </div>
              <div className="flex flex-col items-center p-4 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900 text-center shadow-xs">
                <HelpCircle
                  size={18}
                  className="text-[#6A0F1F] dark:text-[#e4e198] mb-2"
                  strokeWidth={1.5}
                />
                <h4 className="text-[9px] font-bold uppercase tracking-widest text-neutral-800 dark:text-white leading-tight">
                  Easy Returns
                </h4>
                <p className="text-[8px] text-neutral-400 mt-1 leading-normal">
                  Hassle-free 7-day courier collection from your doorstep
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: PREMIUM FORM PANEL (Spans 7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-8 md:p-12 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="font-serif text-xl font-light text-neutral-800 dark:text-white uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-900 pb-3 mb-4">
                Send Message
              </h3>

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your complete name"
                  className="w-full px-4 py-3.5 bg-[#fcfbfa] dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md text-xs font-sans tracking-wide placeholder-neutral-400 text-neutral-800 dark:text-white focus:outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition duration-200"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 bg-[#fcfbfa] dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md text-xs font-sans tracking-wide placeholder-neutral-400 text-neutral-800 dark:text-white focus:outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition duration-200"
                />
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="What is your query about?"
                  className="w-full px-4 py-3.5 bg-[#fcfbfa] dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md text-xs font-sans tracking-wide placeholder-neutral-400 text-neutral-800 dark:text-white focus:outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition duration-200"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-[9px] font-bold text-neutral-400 tracking-[0.2em] uppercase">
                  Message
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={6}
                  required
                  placeholder="Detail your inquiry here..."
                  className="w-full px-4 py-3.5 bg-[#fcfbfa] dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md text-xs font-sans tracking-wide placeholder-neutral-400 text-neutral-800 dark:text-white focus:outline-none focus:border-[#6A0F1F] dark:focus:border-[#e4e198] transition duration-200 resize-none leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#6A0F1F] dark:bg-[#e4e198] hover:bg-neutral-900 dark:hover:bg-white text-white dark:text-neutral-950 text-xs font-semibold uppercase tracking-[0.2em] rounded-md shadow-xs transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
