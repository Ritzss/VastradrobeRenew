import Link from "next/link";

// This is intentionally a separate header from the main VastraDrobe B2C nav —
// the brief calls for a distinct trade identity. Swap `isSignedIn` for your
// real auth check (session/cookie) once wired into existing auth.
const isSignedIn = false;

export default function TradeHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-trade-line bg-trade-offwhite/90 backdrop-blur">
      <div className="mx-auto flex max-w-editorial items-center justify-between px-6 py-5 md:px-10">
        <Link href="/trade" className="flex items-baseline gap-2">
          <span className="font-trade-serif text-2xl tracking-wideish">
            VastraDrobe
          </span>
          <span className="text-xs tracking-[0.2em] text-trade-bronze">
            TRADE
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/trade#collections" className="hover:text-trade-bronze">
            Collections
          </Link>
          <Link href="/trade#how-it-works" className="hover:text-trade-bronze">
            How it works
          </Link>
          {isSignedIn && (
            <Link href="/trade/quick-order" className="hover:text-trade-bronze">
              Quick order
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <Link
              href="/trade/dashboard"
              className="rounded-none border border-trade-charcoal px-5 py-2 text-sm transition-colors duration-300 ease-editorial hover:bg-trade-charcoal hover:text-trade-offwhite"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/trade/login"
                className="hidden text-sm hover:text-trade-bronze sm:inline"
              >
                Sign in
              </Link>
              <Link
                href="/trade/apply"
                className="rounded-none border border-trade-charcoal px-5 py-2 text-sm transition-colors duration-300 ease-editorial hover:bg-trade-charcoal hover:text-trade-offwhite"
              >
                Apply for trade account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
