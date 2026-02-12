"use client";

import Image from "next/image";
import Link from "next/link";
import StarBorder from "@/components/UI/StarBorder";
import PixelCard from "@/components/UI/PixelCard";

type Props = {
  href: string;
  image: string;
  label: string;
  variant: string;
};

const CategoryCard = ({ href, image, label, variant }: Props) => {
  return (
    <StarBorder
      as="button"
      color="#ffffff"
      speed="5s"
      className="cardBlock-Category w-65"
    >
      <Link href={href}>
        <PixelCard variant={variant as any} className="border-0">
          <div className="absolute w-[81%] h-full">
            <div className="group relative w-65 h-85 transition-all duration-500">
              <Image fill sizes="image" src={image} alt={label} className="group-hover:scale-105 transition-all duration-500 -z-1" />
              <div className="h-[10%] text-2xl absolute bottom-0 text-white group-hover:text-[#6a0f1f] group-hover:font-bold group-hover:scale-105 w-full group-hover:opacity-100">
                {label}
              </div>
            </div>
          </div>
        </PixelCard>
      </Link>
    </StarBorder>
  );
};

export default CategoryCard;
