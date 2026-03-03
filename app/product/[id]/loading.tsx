export default function Loading() {
  return (
    <div className="min-h-dvh bg-[#f9f5ef] px-6 md:px-12 py-12 animate-pulse pt-28">
      {/* Breadcrumb */}
      <div className="h-4 w-40 bg-[#e6d8c8] rounded mb-12" />

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* IMAGE SECTION */}
        <div className="space-y-6">
          <div
            className="
            aspect-square
            rounded-[32px]
            bg-[#e6d8c8]
          "
          />

          <div className="flex gap-4">
            <div className="w-20 h-24 bg-[#e6d8c8] rounded-xl" />
            <div className="w-20 h-24 bg-[#e6d8c8] rounded-xl" />
            <div className="w-20 h-24 bg-[#e6d8c8] rounded-xl" />
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-8">
          {/* Title */}
          <div className="space-y-3">
            <div className="h-8 w-3/4 bg-[#e6d8c8] rounded" />
            <div className="h-4 w-full bg-[#e6d8c8] rounded" />
            <div className="h-4 w-5/6 bg-[#e6d8c8] rounded" />
          </div>

          {/* Price */}
          <div className="h-8 w-40 bg-[#e6d8c8] rounded" />

          {/* Color buttons */}
          <div className="flex gap-3">
            <div className="h-10 w-20 bg-[#e6d8c8] rounded-full" />
            <div className="h-10 w-20 bg-[#e6d8c8] rounded-full" />
            <div className="h-10 w-20 bg-[#e6d8c8] rounded-full" />
          </div>

          {/* Size buttons */}
          <div className="flex gap-3">
            <div className="h-10 w-16 bg-[#e6d8c8] rounded-full" />
            <div className="h-10 w-16 bg-[#e6d8c8] rounded-full" />
            <div className="h-10 w-16 bg-[#e6d8c8] rounded-full" />
            <div className="h-10 w-16 bg-[#e6d8c8] rounded-full" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <div className="flex-1 h-14 bg-[#d8c8b6] rounded-full" />
            <div className="flex-1 h-14 bg-[#d8c8b6] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
