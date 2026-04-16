import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-[60] transition-all duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer spinning ring */}
        <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
        {/* Inner sparkle */}
        <div className="absolute text-2xl animate-pulse">✨</div>
      </div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 animate-pulse">
        Taking you there...
      </p>
    </div>
  );
};

export default LoadingOverlay;