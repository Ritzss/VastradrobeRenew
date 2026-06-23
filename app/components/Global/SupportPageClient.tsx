"use client";

import { useState } from "react";

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
        setResponse("Message received. Our team will reach out shortly.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setResponse(data.error || "Something went wrong.");
      }
    } catch {
      setLoading(false);
      setResponse("Network error. Please try again.");
    }
  };

  return (
    <section className="min-h-screen bg-[#f8f5f1] py-32 px-6 flex justify-center">
      <div className="w-full max-w-3xl space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#5f5143]">
            Customer Support
          </h1>
          <p className="text-[#7a6a5c] max-w-xl mx-auto">
            Questions about your order, sizing, returns, or shipping? Our
            support team is ready to assist you.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-10 md:p-14">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* NAME */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#7a6a5c]">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="border border-[#e6d8c8] rounded-xl px-4 py-3 outline-none focus:border-[#5f5143] transition"
              />
            </div>

            {/* EMAIL */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#7a6a5c]">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="border border-[#e6d8c8] rounded-xl px-4 py-3 outline-none focus:border-[#5f5143] transition"
              />
            </div>

            {/* SUBJECT */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#7a6a5c]">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="border border-[#e6d8c8] rounded-xl px-4 py-3 outline-none focus:border-[#5f5143] transition"
              />
            </div>

            {/* MESSAGE */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-[#7a6a5c]">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={6}
                required
                className="border border-[#e6d8c8] rounded-xl px-4 py-3 outline-none focus:border-[#5f5143] transition resize-none"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-4
                rounded-full
                bg-[#5f5143]
                text-white
                font-medium
                hover:bg-[#6a0f1f]
                transition
                disabled:opacity-50
              "
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {/* RESPONSE */}
            {response && (
              <p className="text-center text-sm text-[#5f5143] mt-4">
                {response}
              </p>
            )}
          </form>
        </div>

        {/* TRUST NOTE */}
        <div className="text-center text-sm text-[#957f6a]">
          We typically respond within 24 hours.
        </div>
      </div>
    </section>
  );
}
