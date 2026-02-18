"use client";

import { useState } from "react";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    const res = await fetch("/api/support", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setResponse("Your message has been sent. We’ll get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } else {
      setResponse(data.error || "Something went wrong.");
    }
  };

  return (
    <section className="min-h-screen bg-[#EEDDC7] py-28 px-6 flex justify-center">
      <div className="max-w-2xl w-full bg-white p-10 rounded-xl shadow-lg">
        <h1 className="text-4xl text-[#6a0f1f] font-semibold mb-6 text-center">
          Contact Support
        </h1>

        <p className="text-gray-600 text-center mb-10">
          Have a question about your order, returns, or sizing?
          We’re here to help.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full border-b p-3 outline-none focus:border-[#6a0f1f]"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full border-b p-3 outline-none focus:border-[#6a0f1f]"
          />

          <input
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            className="w-full border-b p-3 outline-none focus:border-[#6a0f1f]"
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Write your message..."
            rows={5}
            required
            className="w-full border-b p-3 outline-none focus:border-[#6a0f1f]"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6a0f1f] text-white py-3 rounded-lg hover:bg-[#4e0c17] transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {response && (
          <p className="mt-6 text-center text-sm text-[#6a0f1f]">
            {response}
          </p>
        )}
      </div>
    </section>
  );
}
