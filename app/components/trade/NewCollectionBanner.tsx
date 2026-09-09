import Image from "next/image";
import Link from "next/link";

export default function NewCollectionBanner() {
  return (
    <section className="relative">
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1800&q=80"
          alt="Autumn Winter 2026 collection"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-trade-charcoal/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-trade-offwhite">
          <p className="text-xs tracking-[0.25em] text-trade-beige">
            AUTUMN / WINTER 2026
          </p>
          <h2 className="mt-4 max-w-lg font-trade-serif text-4xl leading-tight md:text-5xl">
            Crafted for the season ahead.
          </h2>
          <Link
            href="/trade#collections"
            className="mt-8 border border-trade-offwhite px-7 py-3 text-sm transition-colors duration-300 ease-editorial hover:bg-trade-offwhite hover:text-trade-charcoal"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
