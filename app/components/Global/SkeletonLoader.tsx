"use client";

const SkeletonLoader = () => {
  return (
    <div className="flex flex-col animate-pulse">
      {/* IMAGE */}
      <div className="aspect-3/4 w-full rounded-4xl bg-[#f3e7d8]" />

      {/* TEXT */}
      <div className="mt-4 text-center space-y-2">
        <div className="h-4 w-3/4 mx-auto rounded-full bg-[#e6d8c8]" />
        <div className="h-3 w-1/3 mx-auto rounded-full bg-[#e6d8c8]" />
      </div>
    </div>
  );
};

export default SkeletonLoader;
