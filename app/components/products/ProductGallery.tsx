"use client";

import Image from "next/image";

interface Props {
  images: string[];
  openGallery: () => void;
}

export default function ProductGallery({
  images,
  openGallery,
}: Props) {
  return (
    <div className="space-y-4">

      {/* Hero Image */}
      <div className="relative aspect-4/5 overflow-hidden rounded-3xl group">
        <Image
          src={images[0]}
          alt=""
          fill
          priority
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-2 gap-4">

        <div className="relative aspect-4/5 overflow-hidden rounded-2xl group">
          <Image
            src={images[1]}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="relative aspect-4/5 overflow-hidden rounded-2xl group">
          <Image
            src={images[2]}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

      </div>

      {/* Third Row */}
      <div className="grid grid-cols-2 gap-4">

        <div className="relative aspect-4/5 overflow-hidden rounded-2xl group">
          <Image
            src={images[3]}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <button
          onClick={openGallery}
          className="relative aspect-4/5 overflow-hidden rounded-2xl group"
        >
          <Image
            src={images[4] || images[3]}
            alt=""
            fill
            className="object-cover brightness-50 transition duration-500 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">

            <h2 className="text-5xl font-bold">
              +{Math.max(images.length - 4, 0)}
            </h2>

            <p className="mt-2 text-sm uppercase tracking-widest">
              View Gallery
            </p>

          </div>
        </button>

      </div>

    </div>
  );
}