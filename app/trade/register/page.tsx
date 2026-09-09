"use client";

import { useState, FormEvent } from "react";

// This page is for a buyer who has already been approved (see /trade/apply)
// and is setting a password / completing their account for the first time —
// not open self-registration, since wholesale pricing is gated behind approval.

export default function TradeRegisterPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    setSubmitting(true);
    // Integration point: verify the invite token from the query string
    // against the approved application, then create the account in your
    // existing auth system.
    await new Promise((r) => setTimeout(r, 500));
    setSubmitting(false);
    window.location.href = "/trade/dashboard";
  }

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-20">
      <p className="text-xs tracking-[0.25em] text-trade-bronze">
        WELCOME TO TRADE
      </p>
      <h1 className="mt-4 font-trade-serif text-3xl">
        Set up your account
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-trade-brown">
        Your application has been approved. Create a password to access
        trade pricing and place your first order.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">
        <label className="block">
          <span className="text-xs text-trade-brown">Password</span>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-trade-line bg-transparent py-2 text-sm outline-none focus:border-trade-charcoal"
          />
        </label>
        <label className="block">
          <span className="text-xs text-trade-brown">Confirm password</span>
          <input
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full border-b border-trade-line bg-transparent py-2 text-sm outline-none focus:border-trade-charcoal"
          />
        </label>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-trade-charcoal bg-trade-charcoal py-3 text-sm text-trade-offwhite transition-colors duration-300 ease-editorial hover:bg-transparent hover:text-trade-charcoal disabled:opacity-50"
        >
          {submitting ? "Setting up…" : "Create Account"}
        </button>
      </form>
    </section>
  );
}
