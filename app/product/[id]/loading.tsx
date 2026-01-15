export default function Loading() {
  return (
    <div className="min-h-dvh px-12 py-10 grid grid-cols-2 gap-16 animate-pulse">
      <div className="bg-neutral-200 rounded-xl aspect-3/4" />
      <div className="space-y-4">
        <div className="h-8 bg-neutral-200 w-3/4 rounded" />
        <div className="h-4 bg-neutral-200 w-full rounded" />
        <div className="h-4 bg-neutral-200 w-5/6 rounded" />
        <div className="h-10 bg-neutral-300 w-40 rounded-lg mt-6" />
      </div>
    </div>
  );
}
