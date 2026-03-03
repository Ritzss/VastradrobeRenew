import Image from "next/image";

interface ReviewCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
}

export function ReviewCard({
  title,
  description,
  icon,
  image,
}: ReviewCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 h-75 flex flex-col justify-between">
      {/* Top */}
      <div className="flex items-center gap-4">
        <div className="relative w-32 h-32 rounded-full overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold text-[#2B2B2B]">{title}</h4>
          <div>{icon}</div>
        </div>
      </div>

      {/* Review Text */}
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 mt-4">
        {description}
      </p>
    </div>
  );
}
