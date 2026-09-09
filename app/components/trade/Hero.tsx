import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[78vh] min-h-[520px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=80"
          alt="VastraDrobe autumn/winter editorial"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-trade-charcoal/70 via-trade-charcoal/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-editorial px-6 pb-14 text-trade-offwhite md:px-10 md:pb-20">
          <p className="reveal text-xs tracking-[0.25em] text-trade-beige">
            VASTRADROBE TRADE
          </p>
          <h1
            className="reveal mt-4 max-w-xl font-trade-serif text-5xl leading-[1.05] md:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            Wholesale fashion, reimagined.
          </h1>
          <p
            className="reveal mt-5 max-w-md text-sm leading-relaxed text-trade-cream md:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            Discover curated collections, exclusive trade pricing and a
            seamless ordering experience built for modern fashion businesses.
          </p>
          <div
            className="reveal mt-8 flex flex-wrap gap-4"
            style={{ animationDelay: "0.3s" }}
          >
            <Link
              href="/trade/apply"
              className="border border-trade-offwhite bg-trade-offwhite px-7 py-3 text-sm text-trade-charcoal transition-colors duration-300 ease-editorial hover:bg-transparent hover:text-trade-offwhite"
            >
              Apply for Trade Account
            </Link>
            <Link
              href="/trade/login"
              className="border border-trade-offwhite/60 px-7 py-3 text-sm transition-colors duration-300 ease-editorial hover:border-trade-offwhite"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
