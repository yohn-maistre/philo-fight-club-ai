
export const ArenaBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Simple static background without animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} 
        />
      </div>
      
      {/* Simple audience silhouettes without animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/50 to-transparent">
        <div className="flex justify-around items-end h-full px-8 opacity-20">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-700 rounded-t-full"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 20 + 10}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
