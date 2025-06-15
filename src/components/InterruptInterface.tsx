
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Square, Clock, Zap } from "lucide-react";

interface InterruptInterfaceProps {
  philosopher: string;
  onChallengeComplete: (challenge: string) => void;
  onBack: () => void;
}

export const InterruptInterface = ({
  philosopher,
  onChallengeComplete,
  onBack
}: InterruptInterfaceProps) => {
  const [isRecording, setIsRecording] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30);
  const [challenge, setChallenge] = useState("");

  // Sample user challenge
  const sampleChallenge = `Wait, ${philosopher} - you say objective morality is for the weak, but aren't you making an objective claim about what strength means? How do you define 'strong' without some universal standard?`;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleFinishChallenge();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFinishChallenge = () => {
    setIsRecording(false);
    onChallengeComplete(challenge || sampleChallenge);
  };

  // Modern microphone SVG component
  const ModernMicIcon = ({ className }: { className?: string }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
      <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
      <line x1="12" x2="12" y1="18" y2="22"/>
      <line x1="8" x2="16" y1="22" y2="22"/>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <div className="flex items-center gap-3 bg-slate-800/30 backdrop-blur-sm rounded-2xl px-4 py-2 border border-slate-700/50">
            <Clock className="h-4 w-4 text-orange-400" />
            <span className="text-slate-300 text-sm font-medium">Challenge Timer:</span>
            <div className={`font-bold text-lg px-3 py-1 rounded-lg ${
              timeLeft <= 10 
                ? 'text-red-400 bg-red-400/10 animate-pulse' 
                : 'text-orange-400 bg-orange-400/10'
            }`}>
              {timeLeft}s
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Challenge Status - Reduced glow */}
          <div className="text-center mb-12">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 rounded-3xl blur-lg"></div>
              <div className="relative bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-3xl px-8 py-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <Zap className="h-6 w-6 text-red-400 animate-pulse" />
                  <span className="text-red-400 font-bold text-lg tracking-wide">SOCRATIC CHALLENGE ACTIVATED</span>
                  <Zap className="h-6 w-6 text-red-400 animate-pulse" />
                </div>
                <div className="flex items-center justify-center gap-2 text-slate-300">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE CHALLENGE MODE</span>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Challenging: <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">{philosopher.toUpperCase()}</span>
            </h1>
            <p className="text-slate-400">Question their reasoning with Socratic precision</p>
          </div>

          {/* Voice Input Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="relative w-48 h-48 mx-auto mb-8">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full blur-lg animate-pulse"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-red-500/15 to-orange-500/15 backdrop-blur-sm rounded-full flex items-center justify-center border border-red-500/30 shadow-2xl">
                  <ModernMicIcon className="h-20 w-20 text-white drop-shadow-lg" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">YOU ARE SPEAKING</h2>
              {isRecording && (
                <div className="inline-flex items-center gap-2 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-300 text-sm font-medium">RECORDING YOUR CHALLENGE</span>
                </div>
              )}
            </div>
            
            {/* Challenge Display */}
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-3xl p-8 mb-8 min-h-[200px] flex items-center justify-center border border-slate-700/30">
              <div className="text-center">
                <p className="text-slate-200 text-xl leading-relaxed italic mb-6 max-w-4xl">
                  "{sampleChallenge}"
                </p>
                {isRecording && (
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-slate-400 font-medium">Listening for your challenge...</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Control Buttons - Reduced glow */}
            <div className="flex justify-center gap-6">
              <Button 
                onClick={handleFinishChallenge} 
                className="bg-green-600/15 hover:bg-green-600/25 border border-green-500/30 hover:border-green-400/40 text-green-300 hover:text-green-200 font-medium px-8 py-4 rounded-xl text-base backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-green-500/5"
              >
                <Square className="h-5 w-5 mr-2" />
                Finish Challenge
              </Button>
              
              <Button 
                className="bg-slate-800/30 hover:bg-slate-700/40 border border-slate-600/30 hover:border-slate-500/40 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-xl text-base backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                🔄 Continue Speaking
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
