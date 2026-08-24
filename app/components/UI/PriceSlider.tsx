"use client";

import * as Slider from "@radix-ui/react-slider";

interface PriceSliderProps {
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
}

/**
 * 👑 LUXURY REDESIGN: Price Slider Selector (Nangalia Ruchira Theme)
 * 
 * Standardized for pristine consistency:
 * - Brand Color matching: Swapped muddy brown slider accents for rich wine-red (#6A0F1F) and dark ivory (#e4e198).
 * - Sizing/Fonts: Spaced uppercase tracked typography.
 * - Geometric shape: Swapped rounded-full tags for clean rounded-md buttons.
 */
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
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Min Limit
          </p>

          <h4 className="mt-1 text-lg font-serif font-light text-neutral-800 dark:text-white">
            ₹{value[0]}
          </h4>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            Max Limit
          </p>

          <h4 className="mt-1 text-lg font-serif font-light text-neutral-800 dark:text-white">
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
        className="relative flex h-6 w-full touch-none items-center cursor-pointer"
      >
        <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-neutral-200 dark:bg-neutral-800">
          <Slider.Range className="absolute h-full rounded-full bg-[#6A0F1F] dark:bg-[#e4e198]" />
        </Slider.Track>

        <Slider.Thumb
          className="block h-5 w-5 rounded-full border-2 border-white bg-[#6A0F1F] dark:bg-[#e4e198] shadow-md transition hover:scale-110 focus:outline-none"
        />

        <Slider.Thumb
          className="block h-5 w-5 rounded-full border-2 border-white bg-[#6A0F1F] dark:bg-[#e4e198] shadow-md transition hover:scale-110 focus:outline-none"
        />
      </Slider.Root>

      {/* Quick Price Shortcuts */}
      <div className="flex flex-wrap gap-2.5 pt-2">
        {[499, 999, 1499, 1999, 2999].map((price) => (
          <button
            key={price}
            onClick={() => onValueChange([min, price])}
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-[#6A0F1F] hover:text-white hover:border-[#6A0F1F] dark:hover:bg-[#e4e198] dark:hover:text-black dark:hover:border-[#e4e198] transition duration-200 cursor-pointer bg-white dark:bg-neutral-950 shadow-xs"
          >
            Up to ₹{price}
          </button>
        ))}
      </div>

    </div>
  );
}
