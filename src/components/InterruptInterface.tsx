
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Square, Clock, Target, Zap } from "lucide-react";

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
  const [analysisResult, setAnalysisResult] = useState<any>(null);

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

  useEffect(() => {
    // Simulate real-time analysis
    if (isRecording) {
      const analysisTimer = setTimeout(() => {
        setAnalysisResult({
          type: "LOGICAL CONTRADICTION",
          difficulty: "HIGH",
          impact: "May expose core weakness in position",
          reactions: {
            socrates: "nods approvingly...",
            nietzsche: "eyes flash with interest..."
          }
        });
      }, 3000);
      return () => clearTimeout(analysisTimer);
    }
  }, [isRecording]);

  const handleFinishChallenge = () => {
    setIsRecording(false);
    onChallengeComplete(challenge || sampleChallenge);
  };

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
          <div className="text-center mb-8">
            <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse text-lg px-6 py-3 mb-4">
              🚨 SOCRATIC CHALLENGE ACTIVATED! 🚨
            </Badge>
            <h1 className="text-2xl font-bold text-white mb-2">
              Challenging: <span className="text-yellow-400">{philosopher.toUpperCase()}</span>
            </h1>
          </div>

          {/* Voice Input Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-red-500/30">
                <Mic className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">YOU ARE SPEAKING</h2>
              {isRecording && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white">
                  🔴 RECORDING YOUR CHALLENGE
                </Badge>
              )}
            </div>
            
            {/* Challenge Display */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 mb-6 min-h-[150px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-200 text-lg leading-relaxed italic mb-4 max-w-3xl">
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
            <div className="flex justify-center gap-4">
              <Button 
                onClick={handleFinishChallenge} 
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold px-8 py-4 rounded-xl"
              >
                <Square className="h-5 w-5 mr-2" />
                Finish Challenge
              </Button>
              
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-8 py-4 rounded-xl"
              >
                🔄 Continue Speaking
              </Button>
            </div>
          </div>

          {/* Real-time Analysis */}
          {analysisResult && (
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">CHALLENGE ANALYSIS (Real-time AI):</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-yellow-400" />
                    <span className="text-slate-300">Type: </span>
                    <Badge className="bg-yellow-600 text-white">{analysisResult.type}</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-yellow-400" />
                    <span className="text-slate-300">Difficulty: </span>
                    <Badge className="bg-red-600 text-white">{analysisResult.difficulty}</Badge>
                  </div>
                </div>
                
                <div className="bg-slate-900/30 rounded-xl p-4">
                  <p className="text-slate-300 text-sm mb-2">💭 Socrates {analysisResult.reactions.socrates}</p>
                  <p className="text-slate-300 text-sm">🔥 Nietzsche {analysisResult.reactions.nietzsche}</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 rounded-xl border border-yellow-500/20">
                <span className="text-yellow-400 font-semibold">Potential Impact: </span>
                <span className="text-slate-300">{analysisResult.impact}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
