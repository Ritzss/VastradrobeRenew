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
      className="cardBlock w-[25%]"
    >
      <Link href={href}>
        <PixelCard variant={variant as any}>
          <div className="absolute w-full h-full">
            <div className="group relative w-full h-full">
              <Image fill sizes="image" src={image} alt={label} className="-z-1" />
              <div className="h-[10%] text-2xl absolute bottom-0 text-white transition-all duration-500 w-full group-hover:opacity-100">
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
