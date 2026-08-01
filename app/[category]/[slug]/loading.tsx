export default function Loading() {
  return (
    <div className="min-h-screen bg-[#fcfbfa] dark:bg-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-pulse pt-28 select-none">
        {/* 1. BREADCRUMB SKELETON */}
        <div className="border-b border-neutral-100 dark:border-neutral-900 pb-5">
          <div className="h-3 w-48 sm:w-64 bg-neutral-200 dark:bg-neutral-900 rounded" />
        </div>

        {/* 2. MAIN SECTION COLUMN MATCH */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT COLUMN: IMAGES SKELETON (Spans 7 columns to match ProductIdClient) */}
          <div className="lg:col-span-7 w-full space-y-4">
            {/* ================= 📱 MOBILE & TABLET IMAGE SKELETON (< 1024px) ================= */}
            <div className="block lg:hidden w-full relative aspect-[3/4.5] sm:aspect-[4/3] md:aspect-[16/10] rounded-2xl bg-neutral-200 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900" />

            {/* ================= 🖥️ DESKTOP IMAGE SKELETON (>= 1024px) ================= */}
            <div className="hidden lg:block space-y-4 w-full">
              {/* Main Hero Image Placeholder */}
              <div className="relative aspect-[3/4] w-full rounded-2xl bg-neutral-200 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-900" />

              {/* Grid Image Placeholders */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="relative aspect-[3/4.5] w-full rounded-xl bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-900/30" />
                <div className="relative aspect-[3/4.5] w-full rounded-xl bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-100/50 dark:border-neutral-900/30" />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILS SKELETON (Spans 5 columns to match ProductIdClient) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="h-7 w-5/6 bg-neutral-200 dark:bg-neutral-900 rounded-md" />
              <div className="h-5 w-1/3 bg-neutral-200 dark:bg-neutral-900 rounded-md border-b border-neutral-100 dark:border-neutral-900 pb-5" />
            </div>

            {/* Color Swatches */}
            <div className="space-y-3">
              <div className="h-3.5 w-24 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
              <div className="flex gap-2">
                <div className="h-9 w-24 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="h-9 w-24 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
              </div>
            </div>

            {/* Sizes Selector */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-3.5 w-24 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
              </div>

              <div className="flex gap-2.5">
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="flex-1 h-13 bg-neutral-200 dark:bg-neutral-900 rounded-md" />
              <div className="flex-1 h-13 bg-neutral-200 dark:bg-neutral-900 rounded-md" />
            </div>

            {/* Security & Trust marks */}
            <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 dark:border-neutral-900 pt-6">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-900 rounded-full" />
                <div className="h-2 w-14 bg-neutral-100 dark:bg-neutral-900/60 rounded" />
                <div className="h-2 w-10 bg-neutral-100 dark:bg-neutral-900/60 rounded" />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center border-x border-neutral-100 dark:border-neutral-900">
                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-900 rounded-full" />
                <div className="h-2 w-14 bg-neutral-100 dark:bg-neutral-900/60 rounded" />
                <div className="h-2 w-10 bg-neutral-100 dark:bg-neutral-900/60 rounded" />
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <div className="w-4 h-4 bg-neutral-200 dark:bg-neutral-900 rounded-full" />
                <div className="h-2 w-14 bg-neutral-100 dark:bg-neutral-900/60 rounded" />
                <div className="h-2 w-10 bg-neutral-100 dark:bg-neutral-900/60 rounded" />
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-neutral-100 dark:border-neutral-900 pt-3 space-y-4">
              <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4 flex justify-between items-center">
                <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-900 rounded-full" />
              </div>
              <div className="border-b border-neutral-100 dark:border-neutral-900 pb-4 flex justify-between items-center">
                <div className="h-3 w-36 bg-neutral-200 dark:bg-neutral-900 rounded-sm" />
                <div className="w-3 h-3 bg-neutral-200 dark:bg-neutral-900 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
