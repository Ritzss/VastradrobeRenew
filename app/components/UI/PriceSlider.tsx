"use client";

import * as Slider from "@radix-ui/react-slider";

interface PriceSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function PriceSlider({
  value,
  onValueChange,
  min = 0,
  max = 5000,
  step = 100,
}: PriceSliderProps) {
  return (
    <div className="space-y-6">

      <div className="flex justify-between">

        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#957f6a]">
            Min
          </p>

          <h4 className="mt-1 text-lg font-semibold text-[#5f5143]">
            ₹{value[0]}
          </h4>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.25em] text-[#957f6a]">
            Max
          </p>

          <h4 className="mt-1 text-lg font-semibold text-[#5f5143]">
            ₹{value[1]}
          </h4>
        </div>

      </div>

      <Slider.Root
        value={value}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => onValueChange(v as [number, number])}
        className="relative flex h-6 w-full touch-none items-center"
      >

        <Slider.Track className="relative h-2 w-full grow rounded-full bg-[#ece6df]">

          <Slider.Range className="absolute h-full rounded-full bg-[#5f5143]" />

        </Slider.Track>

        <Slider.Thumb
          className="
            block
            h-6
            w-6
            rounded-full
            border-4
            border-white
            bg-[#5f5143]
            shadow-lg
            transition
            hover:scale-110
            focus:outline-none
          "
        />

        <Slider.Thumb
          className="
            block
            h-6
            w-6
            rounded-full
            border-4
            border-white
            bg-[#5f5143]
            shadow-lg
            transition
            hover:scale-110
            focus:outline-none
          "
        />

      </Slider.Root>

      <div className="flex flex-wrap gap-2">

        {[499, 999, 1499, 1999, 2999].map((price) => (

          <button
            key={price}
            onClick={() => onValueChange([min, price])}
            className="rounded-full border border-[#ece6df] px-4 py-2 text-sm hover:bg-[#5f5143] hover:text-white transition"
          >
            ₹{price}
          </button>

        ))}

      </div>

    </div>
  );
}