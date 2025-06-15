
import { Badge } from "@/components/ui/badge";

interface CircularParticipantsProps {
  currentSpeaker: 'philosopher1' | 'philosopher2' | 'moderator' | 'user';
  debateConfig: any;
  philosopherExpressions: {[key: string]: string};
}

export const CircularParticipants = ({ currentSpeaker, debateConfig, philosopherExpressions }: CircularParticipantsProps) => {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Circular Arena Layout */}
      <div className="relative w-full h-96">
        
        {/* Moderator - Top Center (12 o'clock) */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
          <div className={`bg-gradient-to-br from-slate-800/70 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 shadow-xl ${
            currentSpeaker === 'moderator' 
              ? 'border-amber-400/80 shadow-amber-500/30 ring-4 ring-amber-400/20 scale-110 bg-gradient-to-br from-amber-900/30 to-amber-800/20' 
              : 'border-slate-600/40 hover:border-slate-500/50'
          }`}>
            <div className="flex flex-col items-center text-center">
              <div className="text-3xl mb-2">⚖️</div>
              <h4 className="font-bold text-white text-lg font-serif">{debateConfig.moderator.name}</h4>
              <Badge className={`${
                currentSpeaker === 'moderator' 
                  ? 'bg-amber-500/30 text-amber-200 border-amber-400/50' 
                  : 'bg-slate-600/30 text-slate-300 border-slate-500/30'
              } text-xs px-2 py-1 mt-2`}>
                {debateConfig.moderator.subtitle}
              </Badge>
              {currentSpeaker === 'moderator' && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-pulse mt-2">
                  MODERATING
                </Badge>
              )}
              {currentSpeaker !== 'moderator' && (
                <p className="text-slate-400 text-xs italic mt-2 max-w-24">
                  {philosopherExpressions[debateConfig.moderator.name] || "maintaining order"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Philosopher 1 - Bottom Left (8 o'clock) */}
        <div className="absolute bottom-8 left-8">
          {debateConfig.philosophers[0] && (() => {
            const philosopher = debateConfig.philosophers[0];
            const isActive = currentSpeaker === 'philosopher1';
            const colorMap = {
              emerald: 'emerald-400',
              red: 'red-400', 
              blue: 'blue-400',
              purple: 'purple-400'
            };
            const borderColor = colorMap[philosopher.color as keyof typeof colorMap] || 'blue-400';
            
            return (
              <div className={`bg-gradient-to-br from-slate-800/70 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 shadow-xl ${
                isActive 
                  ? `border-${borderColor}/80 shadow-${philosopher.color}-500/30 ring-4 ring-${borderColor}/20 scale-110 bg-gradient-to-br from-${philosopher.color}-900/30 to-${philosopher.color}-800/20` 
                  : 'border-slate-600/40 hover:border-slate-500/50'
              }`}>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">
                    {philosopher.color === 'emerald' && '💭'}
                    {philosopher.color === 'red' && '🔥'}
                    {philosopher.color === 'blue' && '🧠'}
                    {philosopher.color === 'purple' && '⚡'}
                  </div>
                  <h4 className="font-bold text-white text-lg font-serif">{philosopher.name}</h4>
                  <Badge className={`${
                    isActive 
                      ? `bg-${philosopher.color}-500/30 text-${philosopher.color}-200 border-${philosopher.color}-400/50` 
                      : 'bg-slate-600/30 text-slate-300 border-slate-500/30'
                  } text-xs px-2 py-1 mt-2`}>
                    {philosopher.subtitle}
                  </Badge>
                  {isActive && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-pulse mt-2">
                      SPEAKING
                    </Badge>
                  )}
                  {!isActive && (
                    <p className="text-slate-400 text-xs italic mt-2 max-w-24">
                      {philosopherExpressions[philosopher.name] || "pondering existence"}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Philosopher 2 - Bottom Right (4 o'clock) */}
        <div className="absolute bottom-8 right-8">
          {debateConfig.philosophers[1] && (() => {
            const philosopher = debateConfig.philosophers[1];
            const isActive = currentSpeaker === 'philosopher2';
            const colorMap = {
              emerald: 'emerald-400',
              red: 'red-400', 
              blue: 'blue-400',
              purple: 'purple-400'
            };
            const borderColor = colorMap[philosopher.color as keyof typeof colorMap] || 'blue-400';
            
            return (
              <div className={`bg-gradient-to-br from-slate-800/70 to-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border-2 transition-all duration-500 shadow-xl ${
                isActive 
                  ? `border-${borderColor}/80 shadow-${philosopher.color}-500/30 ring-4 ring-${borderColor}/20 scale-110 bg-gradient-to-br from-${philosopher.color}-900/30 to-${philosopher.color}-800/20` 
                  : 'border-slate-600/40 hover:border-slate-500/50'
              }`}>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl mb-2">
                    {philosopher.color === 'emerald' && '💭'}
                    {philosopher.color === 'red' && '🔥'}
                    {philosopher.color === 'blue' && '🧠'}
                    {philosopher.color === 'purple' && '⚡'}
                  </div>
                  <h4 className="font-bold text-white text-lg font-serif">{philosopher.name}</h4>
                  <Badge className={`${
                    isActive 
                      ? `bg-${philosopher.color}-500/30 text-${philosopher.color}-200 border-${philosopher.color}-400/50` 
                      : 'bg-slate-600/30 text-slate-300 border-slate-500/30'
                  } text-xs px-2 py-1 mt-2`}>
                    {philosopher.subtitle}
                  </Badge>
                  {isActive && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs animate-pulse mt-2">
                      SPEAKING
                    </Badge>
                  )}
                  {!isActive && (
                    <p className="text-slate-400 text-xs italic mt-2 max-w-24">
                      {philosopherExpressions[philosopher.name] || "pondering existence"}
                    </p>
                  )}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Arena Center Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-px h-32 bg-gradient-to-t from-yellow-400/20 via-yellow-400/40 to-yellow-400/20"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-px w-32 bg-gradient-to-r from-yellow-400/20 via-yellow-400/40 to-yellow-400/20"></div>
        </div>
      </div>
    </div>
  );
};
