import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Square, Target, Zap, Clock } from "lucide-react";
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
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel Challenge
          </Button>
          
          <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse text-lg px-4 py-2">
            🚨 SOCRATIC CHALLENGE ACTIVATED! 🚨
          </Badge>
        </div>

        {/* Challenge Info */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            You interrupted: <span className="text-yellow-400">{philosopher.toUpperCase()}</span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-red-400" />
            <span className="text-white">Challenge Timer: </span>
            <span className={`font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-yellow-400'}`}>
              {timeLeft} seconds
            </span>
          </div>
        </div>

        {/* Speaking Interface */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Mic className="h-6 w-6 text-red-400" />
                <h2 className="text-xl font-bold text-white">YOU ARE SPEAKING:</h2>
              </div>
              {isRecording && <Badge className="bg-red-500 hover:bg-red-600 text-white">🔴 YOU ARE SPEAKING</Badge>}
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-6 mb-6 min-h-[150px]">
              <p className="text-slate-200 text-lg leading-relaxed italic">
                "{sampleChallenge}"
              </p>
              {isRecording && <div className="flex items-center mt-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse mr-3"></div>
                  <span className="text-slate-400">Listening for your challenge...</span>
                </div>}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button onClick={handleFinishChallenge} className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold px-6 py-3">
                <Square className="h-4 w-4 mr-2" />
                Finish Challenge
              </Button>
              
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white px-6 py-3">
                🔄 Continue Speaking
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Analysis */}
        {analysisResult && <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white">CHALLENGE ANALYSIS (Real-time AI):</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Challenge Type: </span>
                  <Badge className="bg-yellow-600 text-white">{analysisResult.type}</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Difficulty: </span>
                  <Badge className="bg-red-600 text-white">{analysisResult.difficulty}</Badge>
                </div>
                
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-yellow-400 mt-1" />
                  <span className="text-slate-300">Potential Impact: </span>
                  <span className="text-yellow-400">{analysisResult.impact}</span>
                </div>
                
                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                  <p className="text-slate-300 text-sm mb-2">💭 Socrates {analysisResult.reactions.socrates}</p>
                  <p className="text-slate-300 text-sm">🔥 Nietzsche {analysisResult.reactions.nietzsche}</p>
                </div>
              </div>
            </CardContent>
          </Card>}
      </div>
    </div>;
};