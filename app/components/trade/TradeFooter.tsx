import Link from "next/link";

export default function TradeFooter() {
  return (
    <footer className="border-t border-trade-line bg-trade-ivory">
      <div className="mx-auto grid max-w-editorial gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        <div>
          <div className="font-trade-serif text-xl">VastraDrobe Trade</div>
          <p className="mt-3 max-w-xs text-sm text-trade-brown">
            Wholesale fashion, reimagined for boutiques, retailers and modern
            businesses.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-trade-brown">Buy</div>
          <ul className="space-y-2">
            <li><Link href="/trade#collections" className="hover:text-trade-bronze">Collections</Link></li>
            <li><Link href="/trade/quick-order" className="hover:text-trade-bronze">Quick order</Link></li>
            <li><Link href="/trade/request-quote" className="hover:text-trade-bronze">Request a quote</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-trade-brown">Account</div>
          <ul className="space-y-2">
            <li><Link href="/trade/apply" className="hover:text-trade-bronze">Apply for trade account</Link></li>
            <li><Link href="/trade/login" className="hover:text-trade-bronze">Sign in</Link></li>
            <li><Link href="/trade/dashboard" className="hover:text-trade-bronze">Dashboard</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 text-trade-brown">Support</div>
          <ul className="space-y-2">
            <li>trade@vastradrobe.com</li>
            <li>Mon–Sat, 10am–6pm IST</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-trade-line px-6 py-6 text-center text-xs text-trade-brown md:px-10">
        © {new Date().getFullYear()} VastraDrobe Trade. A wholesale platform for approved business partners.
      </div>
    </footer>
  );
}
