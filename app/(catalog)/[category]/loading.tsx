// app/men/loading.tsx

import SkeletonLoader from "@/components/Global/SkeletonLoader";

export default function Loading() {
  return (
    <div className="flex w-full flex-wrap justify-evenly gap-2 min-h-svh dark:bg-black light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonLoader key={i} />
      ))}
    </div>
  );
}
