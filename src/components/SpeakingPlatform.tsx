
import { Badge } from "@/components/ui/badge";

interface SpeakingPlatformProps {
  currentSpeaker: 'philosopher1' | 'philosopher2' | 'moderator' | 'user';
  activeParticipant: any;
  currentStatement: string;
}

export const SpeakingPlatform = ({ currentSpeaker, activeParticipant, currentStatement }: SpeakingPlatformProps) => {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Platform Base */}
      <div className="relative bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-700/30 shadow-2xl">
        
        {/* Speaker Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-2xl sm:text-3xl md:text-4xl">
              {activeParticipant?.color === 'emerald' && '💭'}
              {activeParticipant?.color === 'red' && '🔥'}
              {activeParticipant?.color === 'blue' && '🧠'}
              {activeParticipant?.color === 'purple' && '⚡'}
              {activeParticipant?.color === 'amber' && '⚖️'}
              {currentSpeaker === 'moderator' && '⚖️'}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white font-serif tracking-wide">
                {activeParticipant?.name?.toUpperCase() || 'MODERATOR'}
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-1">
                {activeParticipant?.subtitle || 'The Moderator'}
              </p>
            </div>
          </div>
        </div>
        
        {/* Clean Speech Container */}
        <div className="bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-slate-600/20 min-h-[120px] sm:min-h-[160px] flex flex-col justify-center">
          <div className="text-center">
            <p className="text-slate-200 text-base sm:text-lg md:text-xl leading-relaxed italic mb-4 sm:mb-6 font-serif">
              "{currentStatement}"
            </p>
            
            {/* Clean Speaking Indicator */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-slate-400 text-sm font-medium">Speaking...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
