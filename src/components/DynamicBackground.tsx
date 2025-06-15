
export const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 animate-gradient-shift" />
      
      {/* Geometric patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-yellow-400 rotate-45 animate-spin-slow" />
        <div className="absolute top-3/4 right-1/4 w-24 h-24 border border-emerald-400 rotate-12 animate-pulse" />
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 bg-red-400 rounded-full animate-bounce-slow" />
        <div className="absolute top-1/3 right-1/3 w-20 h-20 border-2 border-purple-400 animate-ping" style={{ animationDuration: '4s' }} />
      </div>
    </div>
  );
};
