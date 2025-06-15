
import { useEffect, useState } from "react";

export const ArenaBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    // Generate floating particles for atmosphere
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Colosseum Arena Background */}
      <div className="absolute inset-0 bg-gradient-radial from-slate-800/20 via-slate-900/40 to-slate-900/80"></div>
      
      {/* Animated Audience Silhouettes */}
      <div className="absolute inset-0">
        {/* Top audience rows */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/60 to-transparent">
          <div className="flex justify-around items-end h-full px-8">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={`top-${i}`}
                className="w-3 bg-slate-700/40 rounded-t-full animate-pulse"
                style={{
                  height: `${Math.random() * 20 + 15}px`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Left audience */}
        <div className="absolute left-0 top-32 bottom-32 w-20 bg-gradient-to-r from-slate-900/60 to-transparent">
          <div className="flex flex-col justify-around items-center h-full py-8">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`left-${i}`}
                className="h-4 bg-slate-700/40 rounded-r-full animate-pulse"
                style={{
                  width: `${Math.random() * 15 + 10}px`,
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: `${2.5 + Math.random() * 1.5}s`
                }}
              />
            ))}
          </div>
        </div>

        {/* Right audience */}
        <div className="absolute right-0 top-32 bottom-32 w-20 bg-gradient-to-l from-slate-900/60 to-transparent">
          <div className="flex flex-col justify-around items-center h-full py-8">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`right-${i}`}
                className="h-4 bg-slate-700/40 rounded-l-full animate-pulse"
                style={{
                  width: `${Math.random() * 15 + 10}px`,
                  animationDelay: `${i * 0.4}s`,
                  animationDuration: `${3 + Math.random() * 1}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Floating Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s'
          }}
        />
      ))}

      {/* Arena Floor Glow */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-32 bg-gradient-to-t from-yellow-400/10 via-yellow-400/5 to-transparent rounded-full blur-xl"></div>
    </div>
  );
};
