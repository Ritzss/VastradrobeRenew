export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f1e7] relative overflow-hidden">
      {/* Ambient gradient glow */}
      <div className="absolute w-125 h-125 bg-[#e9e1d4] rounded-full blur-3xl opacity-40 animate-pulse" />

      {/* Floating rotating soft ring */}
      <div className="relative flex flex-col items-center">
        <div className="relative w-28 h-28">
          {/* Outer glass ring */}
          <div className="absolute inset-0 rounded-full border border-[#957f6a]/40 animate-spin [animation-duration:8s]" />

          {/* Inner rotating arc */}
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-[#957f6a] border-r-[#957f6a]/60 animate-spin [animation-duration:2.5s]" />

          {/* Center logo dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-[#957f6a] animate-ping" />
          </div>
        </div>

        {/* Text */}
        <div className="mt-8 text-center">
          <p className="text-[#5f5143] text-lg font-medium tracking-wide">
            Preparing your experience
          </p>
          <p className="mt-2 text-sm text-[#957f6a]/70 tracking-widest uppercase">
            Please wait
          </p>
        </div>
      </div>
    </div>
  );
}
