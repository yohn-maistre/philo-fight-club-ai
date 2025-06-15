
import { Badge } from "@/components/ui/badge";

interface SpeakingPlatformProps {
  currentSpeaker: 'philosopher1' | 'philosopher2' | 'moderator' | 'user';
  activeParticipant: any;
  currentStatement: string;
}

export const SpeakingPlatform = ({ currentSpeaker, activeParticipant, currentStatement }: SpeakingPlatformProps) => {
  return (
    <div className="relative">
      {/* Platform Base with Glow */}
      <div className="absolute -inset-8 bg-gradient-to-t from-yellow-400/20 via-yellow-400/10 to-transparent rounded-full blur-xl animate-pulse"></div>
      
      {/* Central Platform */}
      <div className="relative bg-gradient-to-br from-slate-800/80 via-slate-700/60 to-slate-800/80 backdrop-blur-sm rounded-3xl p-8 border-2 border-yellow-400/30 shadow-2xl">
        {/* Spotlight Effect */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-b from-yellow-400/30 to-transparent rounded-full blur-sm"></div>
        
        {/* Speaker Info */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="text-4xl animate-bounce" style={{ animationDuration: '2s' }}>
              {activeParticipant?.color === 'emerald' && '💭'}
              {activeParticipant?.color === 'red' && '🔥'}
              {activeParticipant?.color === 'blue' && '🧠'}
              {activeParticipant?.color === 'purple' && '⚡'}
              {activeParticipant?.color === 'amber' && '⚖️'}
              {currentSpeaker === 'moderator' && '⚖️'}
            </div>
            <div>
              <h2 className="text-3xl font-bold text-yellow-200 font-serif tracking-wide">
                {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
              </h2>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/50 mt-2">
                {activeParticipant?.subtitle || 'The Moderator'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Speech Container with Enhanced Styling */}
        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/20 min-h-[200px] flex items-center justify-center">
          <div className="text-center max-w-3xl">
            <p className="text-yellow-100 text-xl leading-relaxed italic mb-6 font-serif">
              "{currentStatement}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <span className="text-yellow-300 font-medium">Speaking...</span>
            </div>
          </div>
        </div>

        {/* Platform Decoration */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-gradient-to-t from-yellow-400/40 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};
