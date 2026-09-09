import Image from "next/image";
import Link from "next/link";
import { buyerOrders, buyerProfile, tradeProducts } from "@/lib/trade/mock-data";

const statusStyles: Record<string, string> = {
  Delivered: "text-trade-brown",
  Shipped: "text-trade-bronze",
  Processing: "text-trade-bronze",
  "Awaiting Payment": "text-red-700",
};

export default function TradeDashboardPage() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <section className="mx-auto max-w-editorial px-6 py-14 md:px-10">
      <h1 className="font-trade-serif text-4xl">
        {greeting}, {buyerProfile.businessName}
      </h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Outstanding Orders" value={buyerProfile.outstandingOrders} />
        <StatCard label="Pending Orders" value={buyerProfile.pendingOrders} />
        <StatCard
          label="Total Trade Spend"
          value={`₹${buyerProfile.totalSpend.toLocaleString("en-IN")}`}
        />
        {buyerProfile.availableCredit !== null && (
          <StatCard
            label="Available Credit"
            value={`₹${buyerProfile.availableCredit.toLocaleString("en-IN")}`}
          />
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <QuickAction href="/trade/quick-order" label="New Order" />
        <QuickAction href="/trade/quick-order" label="Quick Order" />
        <QuickAction href="#recent-orders" label="Reorder" />
        <QuickAction href="/trade/catalogue" label="Download Catalogue" />
      </div>

      <div id="recent-orders" className="mt-16">
        <h2 className="font-trade-serif text-2xl">Recent orders</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-trade-line text-left text-trade-brown">
                <th className="py-3 font-normal">Order</th>
                <th className="py-3 font-normal">Date</th>
                <th className="py-3 font-normal">Amount</th>
                <th className="py-3 font-normal">Status</th>
                <th className="py-3 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {buyerOrders.map((o) => (
                <tr key={o.id} className="border-b border-trade-line/60">
                  <td className="py-4">{o.id}</td>
                  <td className="py-4 text-trade-brown">
                    {new Date(o.date).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4">₹{o.amount.toLocaleString("en-IN")}</td>
                  <td className={`py-4 ${statusStyles[o.status]}`}>{o.status}</td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button className="border-b border-trade-charcoal">View</button>
                      <button className="border-b border-trade-charcoal">Reorder</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-trade-serif text-2xl">Recommended for your store</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tradeProducts.map((p) => (
            <Link key={p.slug} href={`/trade/product/${p.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-trade-cream">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="font-trade-serif">{p.name}</span>
                <span className="text-sm text-trade-bronze">
                  ₹{p.tradePrice.toLocaleString("en-IN")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border-t border-trade-line pt-4">
      <p className="text-xs text-trade-brown">{label}</p>
      <p className="mt-2 font-trade-serif text-2xl">{value}</p>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border border-trade-charcoal px-6 py-2.5 text-sm transition-colors duration-300 ease-editorial hover:bg-trade-charcoal hover:text-trade-offwhite"
    >
      {label}
    </Link>
  );
}
