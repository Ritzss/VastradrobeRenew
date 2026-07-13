"use client";

import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders above ₹999",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "7-Day hassle-free returns",
  },
  {
    icon: Sparkles,
    title: "Premium Quality",
    desc: "Crafted with care",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% encrypted checkout",
  },
];

export default function TrustSection() {
  return (
    <section className="rounded-3xl dark:bg-[#00000085] bg-[#faf8f5] border not-dark:border-[#ece6df] py-10 px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center">
                <Icon
                  size={26}
                  className="text-[#5f5143]"
                />
              </div>

              <h3 className="mt-4 font-medium text-[#5f5143]">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-[#8c7a69]">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}