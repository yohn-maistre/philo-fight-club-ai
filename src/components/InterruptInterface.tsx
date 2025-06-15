
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Square, Clock } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-red-400" />
            <span className="text-white">Challenge Timer: </span>
            <span className={`font-bold text-xl ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Challenge Status */}
          <div className="text-center mb-12">
            <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse text-lg px-6 py-3 mb-6">
              🚨 SOCRATIC CHALLENGE ACTIVATED! 🚨
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-4">
              Challenging: <span className="text-yellow-400">{philosopher.toUpperCase()}</span>
            </h1>
          </div>

          {/* Voice Input Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30">
                <ModernMicIcon className="h-20 w-20 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">YOU ARE SPEAKING</h2>
              {isRecording && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  🔴 RECORDING YOUR CHALLENGE
                </Badge>
              )}
            </div>
            
            {/* Challenge Display */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-8 mb-8 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-200 text-xl leading-relaxed italic mb-6 max-w-4xl">
                  "{sampleChallenge}"
                </p>
                {isRecording && (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-400">Listening for your challenge...</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex justify-center gap-6">
              <Button 
                onClick={handleFinishChallenge} 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold px-10 py-6 rounded-2xl text-lg hover:transform hover:scale-105 transition-all shadow-lg"
              >
                <Square className="h-5 w-5 mr-2" />
                Finish Challenge
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-10 py-6 rounded-2xl text-lg hover:transform hover:scale-105 transition-all"
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
