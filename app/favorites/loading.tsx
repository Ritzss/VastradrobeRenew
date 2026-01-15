// app/men/loading.tsx

import SkeletonLoader from "@/components/Global/SkeletonLoader";

export default function Loading() {
  return (
    <div className="flex flex-wrap justify-evenly p-6 min-h-svh">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </div>
  );
}
