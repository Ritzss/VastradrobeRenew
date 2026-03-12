// app/men/loading.tsx

import SkeletonLoader from "@/components/Global/SkeletonLoader";

export default function Loading() {
  return (
    <div className="flex w-full flex-wrap justify-evenly gap-2 min-h-svh bg-[#f9f5ef]">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </div>
  );
}
