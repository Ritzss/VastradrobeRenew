import Link from "next/link";

interface EmptyStateProps {
  label?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const EmptyState = ({
  label = "Coming Soon",
  title = "Something Beautiful is on the Way",
  description = "We’re preparing this collection with care. Check back soon for thoughtfully crafted pieces made just for you.",
  buttonText = "Explore Collections →",
  buttonLink = "/",
}: EmptyStateProps) => {
  return (
    <section className="dark:bg-black not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] py-32">
      <div className="max-w-2xl mx-auto px-6 text-center space-y-8">
        {/* LABEL */}
        <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
          {label}
        </p>

        {/* TITLE */}
        <h2 className="text-4xl md:text-5xl font-semibold text-[#5f5143] leading-tight">
          {title}
        </h2>

        {/* DESCRIPTION */}
        <p className="text-[#7a6a5c] text-lg leading-relaxed">{description}</p>

        {/* DIVIDER */}
        <div className="h-px w-20 bg-[#e6d8c8] mx-auto" />

        {/* CTA */}
        <Link
          href={buttonLink}
          className=" inline-block px-10 py-3 rounded-full border border-[#5f5143] text-[#5f5143] hover:bg-[#5f5143] hover:text-white transition"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default EmptyState;
