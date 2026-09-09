const benefits = [
  {
    title: "Curated Collections",
    copy: "Seasonal and commercially relevant collections selected for modern retailers.",
  },
  {
    title: "Trade Pricing",
    copy: "Exclusive wholesale pricing available to approved business accounts.",
  },
  {
    title: "Flexible Ordering",
    copy: "Build orders by style, size, color and quantity.",
  },
  {
    title: "Dedicated Support",
    copy: "A professional trade experience for growing businesses.",
  },
];

export default function WhyTrade() {
  return (
    <section className="mx-auto max-w-editorial px-6 py-24 md:px-10">
      <h2 className="font-trade-serif text-3xl md:text-4xl">
        Built for the way fashion businesses buy.
      </h2>
      <div className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-4">
        {benefits.map((b) => (
          <div key={b.title} className="border-t border-trade-line pt-6">
            <h3 className="font-trade-serif text-xl">{b.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-trade-brown">
              {b.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
