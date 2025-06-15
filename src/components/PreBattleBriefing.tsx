
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Play, Volume2, CheckCircle } from "lucide-react";

interface PreBattleBriefingProps {
  battleId: string;
  onStart: () => void;
  onBack: () => void;
}

export const PreBattleBriefing = ({ battleId, onStart, onBack }: PreBattleBriefingProps) => {
  const [countdown, setCountdown] = useState(30);
  const [micChecked, setMicChecked] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const battleConfig = {
    title: "The Morality Clash",
    topic: "Is morality objective or subjective?",
    philosophers: [
      { name: "Socrates", quote: "The unexamined life is not worth living", strategy: "Will question your assumptions" },
      { name: "Nietzsche", quote: "What does not destroy me makes me stronger", strategy: "Will challenge traditional values" }
    ],
    tips: [
      "Ask for definitions when they use abstract terms",
      "Look for contradictions in their reasoning",
      "Challenge their assumptions about human nature",
      "Use 'What if...' scenarios to test their logic"
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : prev);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMicCheck = () => {
    setMicChecked(true);
    setTimeout(() => setIsReady(true), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-400 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-emerald-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Battles
          </Button>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{countdown}s</div>
            <Badge className="bg-yellow-600 text-white">Briefing Time</Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Battle Overview */}
          <Card className="lg:col-span-2 bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white mb-2 font-serif">{battleConfig.title}</h1>
                <p className="text-xl text-yellow-400 italic">"{battleConfig.topic}"</p>
              </div>

              {/* Philosophers */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {battleConfig.philosophers.map((philosopher, index) => (
                  <div key={philosopher.name} className="relative">
                    <Card className={`bg-gradient-to-br ${index === 0 ? 'from-emerald-500/20 to-emerald-600/10' : 'from-red-500/20 to-red-600/10'} border-slate-600`}>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{index === 0 ? '💭' : '🔥'}</div>
                        <h3 className="text-xl font-bold text-white mb-2 font-serif">{philosopher.name}</h3>
                        <p className="text-slate-300 italic text-sm mb-3">"{philosopher.quote}"</p>
                        <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                          {philosopher.strategy}
                        </Badge>
                        <Button size="sm" variant="outline" className="mt-3 w-full border-slate-600">
                          <Volume2 className="h-3 w-3 mr-2" />
                          Preview Voice
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Socratic Tips */}
              <Card className="bg-slate-900/50 border-slate-600">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-yellow-400 mb-4 flex items-center">
                    <div className="text-2xl mr-2">🎯</div>
                    Socratic Strategy Tips
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {battleConfig.tips.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="text-yellow-400 mt-1">•</div>
                        <span className="text-slate-300 text-sm">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Setup Panel */}
          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Mic className="h-5 w-5 mr-2 text-yellow-400" />
                Voice Setup
              </h3>

              <div className="space-y-4">
                {/* Mic Check */}
                <div className="p-4 rounded-lg border border-slate-600 bg-slate-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Microphone Check</span>
                    {micChecked && <CheckCircle className="h-5 w-5 text-green-400" />}
                  </div>
                  {!micChecked ? (
                    <Button onClick={handleMicCheck} size="sm" className="w-full bg-yellow-600 hover:bg-yellow-500">
                      <Play className="h-4 w-4 mr-2" />
                      Test Microphone
                    </Button>
                  ) : (
                    <div className="text-green-400 text-sm">✓ Microphone working perfectly</div>
                  )}
                </div>

                {/* Voice Settings */}
                <div className="p-4 rounded-lg border border-slate-600 bg-slate-900/50">
                  <span className="text-slate-300 block mb-2">Voice Sensitivity</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full w-3/4"></div>
                    </div>
                    <span className="text-xs text-slate-400">High</span>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 rounded-lg border border-yellow-600/30 bg-yellow-600/10">
                  <h4 className="text-yellow-400 font-semibold mb-2">How to Interrupt:</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Listen for key moments</li>
                    <li>• Click "INTERRUPT NOW!"</li>
                    <li>• Speak your challenge clearly</li>
                    <li>• Watch them respond!</li>
                  </ul>
                </div>
              </div>

              {/* Start Button */}
              <Button 
                onClick={onStart}
                disabled={!isReady}
                className={`w-full mt-6 py-3 text-lg font-bold ${
                  isReady 
                    ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 animate-pulse' 
                    : 'bg-slate-600 cursor-not-allowed'
                }`}
              >
                {isReady ? (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    START BATTLE!
                  </>
                ) : (
                  'Complete Setup First'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
