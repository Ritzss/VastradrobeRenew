import type { Metadata } from "next";
import TradeHeader from "@/components/trade/TradeHeader";
import TradeFooter from "@/components/trade/TradeFooter";

export const metadata: Metadata = {
  title: "VastraDrobe Trade — Wholesale fashion, reimagined.",
  description:
    "A curated fashion platform for boutiques, retailers and modern businesses.",
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-trade-sans bg-trade-offwhite text-trade-charcoal">
      <TradeHeader />
      <main>{children}</main>
      <TradeFooter />
    </div>
  );
}
