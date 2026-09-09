"use client";

import { useState, FormEvent } from "react";
import { BusinessType } from "@/lib/trade/types";

const businessTypes: BusinessType[] = [
  "Boutique",
  "Retailer",
  "Reseller",
  "Corporate",
  "Event",
  "Other",
];

interface FormState {
  businessName: string;
  businessType: BusinessType;
  contactPerson: string;
  email: string;
  phone: string;
  gstin: string;
  pan: string;
  address: string;
  website: string;
  instagram: string;
  expectedMonthlyOrder: string;
  interestedCategories: string;
}

const initialState: FormState = {
  businessName: "",
  businessType: "Boutique",
  contactPerson: "",
  email: "",
  phone: "",
  gstin: "",
  pan: "",
  address: "",
  website: "",
  instagram: "",
  expectedMonthlyOrder: "",
  interestedCategories: "",
};

export default function ApplyPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Integration point: replace with a real request to your API route,
    // e.g. POST /api/trade/applications, which writes into the shared
    // buyer/application table and notifies the admin B2B Management area.
    await new Promise((r) => setTimeout(r, 600));

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="text-xs tracking-[0.25em] text-trade-bronze">
          APPLICATION RECEIVED
        </p>
        <h1 className="mt-4 font-trade-serif text-3xl">
          Thank you, {form.businessName || "there"}.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-trade-brown">
          The VastraDrobe team will review your application and verify your
          business details. Approved partners typically hear back within
          2–3 business days at {form.email || "the email you provided"}.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-20 md:px-10">
      <p className="text-xs tracking-[0.25em] text-trade-bronze">
        TRADE ACCOUNT APPLICATION
      </p>
      <h1 className="mt-4 font-trade-serif text-4xl">
        Tell us about your business.
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-trade-brown">
        Every application is reviewed by our team before trade pricing and
        wholesale ordering are unlocked.
      </p>

      <form onSubmit={handleSubmit} className="mt-12 space-y-8">
        <Field label="Business name" required>
          <input
            required
            value={form.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            className={inputClass}
          />
        </Field>

        <Field label="Business type" required>
          <select
            required
            value={form.businessType}
            onChange={(e) => update("businessType", e.target.value as BusinessType)}
            className={inputClass}
          >
            {businessTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="Contact person" required>
            <input
              required
              value={form.contactPerson}
              onChange={(e) => update("contactPerson", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="Phone" required>
            <input
              required
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Website">
            <input
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://"
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="GSTIN" required>
            <input
              required
              value={form.gstin}
              onChange={(e) => update("gstin", e.target.value.toUpperCase())}
              className={inputClass}
            />
          </Field>
          <Field label="PAN" required>
            <input
              required
              value={form.pan}
              onChange={(e) => update("pan", e.target.value.toUpperCase())}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Business address" required>
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-8 sm:grid-cols-2">
          <Field label="Instagram">
            <input
              value={form.instagram}
              onChange={(e) => update("instagram", e.target.value)}
              placeholder="@yourbusiness"
              className={inputClass}
            />
          </Field>
          <Field label="Expected monthly order">
            <input
              value={form.expectedMonthlyOrder}
              onChange={(e) => update("expectedMonthlyOrder", e.target.value)}
              placeholder="e.g. ₹50,000 – ₹1,00,000"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Interested categories">
          <input
            value={form.interestedCategories}
            onChange={(e) => update("interestedCategories", e.target.value)}
            placeholder="e.g. Kurtas, co-ord sets, festive wear"
            className={inputClass}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="mt-4 w-full border border-trade-charcoal bg-trade-charcoal py-4 text-sm text-trade-offwhite transition-colors duration-300 ease-editorial hover:bg-transparent hover:text-trade-charcoal disabled:opacity-50 sm:w-auto sm:px-10"
        >
          {submitting ? "Submitting…" : "Submit Application"}
        </button>
      </form>
    </section>
  );
}

const inputClass =
  "w-full border-b border-trade-line bg-transparent py-2 text-sm outline-none transition-colors duration-200 focus:border-trade-charcoal";

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs text-trade-brown">
        {label}
        {required && <span className="text-trade-bronze"> *</span>}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}
