"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function TradeLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Integration point: call your existing auth (e.g. next-auth signIn,
    // or a POST /api/auth/login shared with the B2C login) then check the
    // account has an approved trade profile before redirecting.
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    window.location.href = "/trade/dashboard";
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-20">
      <p className="text-xs tracking-[0.25em] text-trade-bronze">TRADE ACCOUNT</p>
      <h1 className="mt-4 font-trade-serif text-3xl">Sign in</h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <label className="block">
          <span className="text-xs text-trade-brown">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-trade-line bg-transparent py-2 text-sm outline-none focus:border-trade-charcoal"
          />
        </label>
        <label className="block">
          <span className="text-xs text-trade-brown">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-trade-line bg-transparent py-2 text-sm outline-none focus:border-trade-charcoal"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-trade-charcoal bg-trade-charcoal py-3 text-sm text-trade-offwhite transition-colors duration-300 ease-editorial hover:bg-transparent hover:text-trade-charcoal disabled:opacity-50"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-8 text-sm text-trade-brown">
        Don&apos;t have a trade account yet?{" "}
        <Link href="/trade/apply" className="text-trade-charcoal underline">
          Apply for one
        </Link>
        .
      </p>
    </section>
  );
}
