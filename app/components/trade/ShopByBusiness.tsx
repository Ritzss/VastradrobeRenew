import Image from "next/image";

const segments = [
  {
    title: "Boutiques",
    copy: "Curated collections for independent fashion stores.",
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&q=80",
  },
  {
    title: "Retailers",
    copy: "Reliable collections for established retail businesses.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&q=80",
  },
  {
    title: "Resellers",
    copy: "Wholesale products designed for profitable resale.",
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=900&q=80",
  },
  {
    title: "Corporate & Events",
    copy: "Bulk fashion orders for events, gifting and organizations.",
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=900&q=80",
  },
];

export default function ShopByBusiness() {
  return (
    <section className="bg-trade-ivory py-24">
      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <h2 className="font-trade-serif text-3xl md:text-4xl">
          Shop by business
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {segments.map((s) => (
            <a
              key={s.title}
              href="#collections"
              className="group relative block aspect-[3/4] overflow-hidden"
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trade-charcoal/80 via-trade-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-trade-offwhite">
                <h3 className="font-trade-serif text-xl">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-trade-cream opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {s.copy}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
