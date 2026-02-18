export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#EEDDC7]">
      
      {/* Outer rotating ring */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#cd0000] border-t-transparent animate-spin"></div>
        <div className="absolute inset-4 rounded-full border-4 border-[#cd0000]/40 border-b-transparent animate-spin [animation-duration:1.5s]"></div>
      </div>

      {/* Text */}
      <p className="mt-6 text-[#cd0000] text-xl font-semibold tracking-wide animate-pulse">
        Loading your fashion...
      </p>
    </div>
  );
}
