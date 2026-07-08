// app/men/loading.tsx

import SkeletonLoader from "@/components/Global/SkeletonLoader";

export default function Loading() {
  return (
    <div className="flex flex-wrap justify-evenly p-6 min-h-svh bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </div>
  );
}
