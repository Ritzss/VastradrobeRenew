const steps = [
  {
    n: "01",
    title: "Apply",
    copy: "Submit your business details.",
  },
  {
    n: "02",
    title: "Get Approved",
    copy: "Our team verifies your trade account.",
  },
  {
    n: "03",
    title: "Build Your Order",
    copy: "Browse collections and order by size, color and quantity.",
  },
  {
    n: "04",
    title: "Receive & Reorder",
    copy: "Track your shipment and reorder best sellers easily.",
  },
];

export default function HowTradeWorks() {
  return (
    <section id="how-it-works" className="bg-trade-charcoal py-24 text-trade-offwhite">
      <div className="mx-auto max-w-editorial px-6 md:px-10">
        <h2 className="font-trade-serif text-3xl md:text-4xl">How trade works</h2>

        <div className="mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className={`border-t border-trade-offwhite/20 pt-6 ${
                i > 0 ? "md:border-l md:border-t-0 md:pl-6 md:pt-0" : ""
              }`}
            >
              <span className="font-trade-serif text-sm text-trade-bronze">{s.n}</span>
              <h3 className="mt-3 font-trade-serif text-xl">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-trade-beige">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
