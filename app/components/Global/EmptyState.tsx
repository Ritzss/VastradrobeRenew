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
    <div className="flex flex-col items-center justify-center py-15 text-center">
      
      <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
        {label}
      </p>

      <h2 className="text-4xl text-[#6a0f1f] font-semibold mb-6">
        {title}
      </h2>

      <p className="text-gray-600 max-w-md mb-10">
        {description}
      </p>

      <div className="h-px w-24 bg-gray-300 mb-10" />

      <Link
        href={buttonLink}
        className="inline-block border border-black px-8 py-3 rounded-full hover:bg-[#6a0f1f] hover:text-white transition-all duration-300"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default EmptyState;
