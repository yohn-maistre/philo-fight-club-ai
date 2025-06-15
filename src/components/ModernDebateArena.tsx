
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Zap, Clock, Target, Pause, Play } from "lucide-react";

interface ModernDebateArenaProps {
  debateId: string;
  onBack: () => void;
}

export const ModernDebateArena = ({ debateId, onBack }: ModernDebateArenaProps) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<'philosopher1' | 'philosopher2'>('philosopher1');
  const [isPlaying, setIsPlaying] = useState(true);
  const [debateTime, setDebateTime] = useState(0);
  const [challengeCount, setChallengeCount] = useState(0);
  const [interruptPower, setInterruptPower] = useState(75);

  const debate = {
    title: "The Morality Clash",
    philosophers: [
      { 
        name: "Socrates", 
        color: "emerald", 
        avatar: "💭",
        currentStatement: "Before we can discuss whether morality is objective, shouldn't we first examine what we mean by 'morality' itself? For how can we judge the nature of something we haven't properly defined...",
        mood: "curious",
        energy: 85
      },
      { 
        name: "Nietzsche", 
        color: "red", 
        avatar: "🔥",
        currentStatement: "Your precious 'objective morality' is nothing but the bleating of weak souls who lack the courage to create their own values! The Übermensch transcends such slave morality...",
        mood: "intense",
        energy: 92
      }
    ]
  };

  const activeSpeaker = debate.philosophers[currentSpeaker === 'philosopher1' ? 0 : 1];
  const otherSpeaker = debate.philosophers[currentSpeaker === 'philosopher1' ? 1 : 0];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setDebateTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const handleInterrupt = () => {
    setChallengeCount(prev => prev + 1);
    setInterruptPower(prev => Math.min(100, prev + 15));
    // Switch speakers after interrupt
    setTimeout(() => {
      setCurrentSpeaker(prev => prev === 'philosopher1' ? 'philosopher2' : 'philosopher1');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10">
        <div className={`absolute top-20 left-20 w-64 h-64 ${
          activeSpeaker.color === 'emerald' ? 'bg-emerald-400' : 'bg-red-400'
        } rounded-full blur-3xl transition-all duration-1000 animate-pulse`} />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-yellow-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Arena
          </Button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white font-serif">{debate.title}</h1>
            <div className="flex items-center justify-center gap-4 text-slate-400 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTime(debateTime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>{challengeCount} challenges</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => setIsPlaying(!isPlaying)}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
        </div>

        {/* Main Arena Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Philosophers Panel */}
          <div className="lg:col-span-3 space-y-6">
            {/* Active Speaker */}
            <Card className={`bg-gradient-to-r ${
              activeSpeaker.color === 'emerald' 
                ? 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30' 
                : 'from-red-500/20 to-red-600/10 border-red-500/30'
            } backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.02]`}>
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="text-6xl animate-bounce">{activeSpeaker.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-white font-serif">{activeSpeaker.name}</h2>
                      <Badge className="bg-green-500 text-white animate-pulse">SPEAKING</Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-green-400 text-sm">Live</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm">Energy:</span>
                        <div className="w-16 bg-slate-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              activeSpeaker.color === 'emerald' ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                            style={{ width: `${activeSpeaker.energy}%` }}
                          />
                        </div>
                        <span className="text-sm text-white">{activeSpeaker.energy}%</span>
                      </div>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 capitalize">
                        {activeSpeaker.mood}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Speech Bubble */}
                <div className="relative">
                  <div className="bg-slate-900/70 rounded-2xl p-6 border border-slate-600/50">
                    <p className="text-slate-200 text-lg leading-relaxed italic">
                      "{activeSpeaker.currentStatement}"
                    </p>
                    
                    {/* Speech Waveform Visualization */}
                    <div className="flex items-center gap-1 mt-4">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 ${
                            activeSpeaker.color === 'emerald' ? 'bg-emerald-400' : 'bg-red-400'
                          } rounded-full transition-all duration-150`}
                          style={{
                            height: `${Math.random() * 20 + 5}px`,
                            animationDelay: `${i * 100}ms`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Speech bubble pointer */}
                  <div className={`absolute -top-2 left-8 w-4 h-4 ${
                    activeSpeaker.color === 'emerald' ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  } rotate-45 border-l border-t border-slate-600/50`} />
                </div>

                {/* Interrupt Button */}
                <div className="text-center mt-8">
                  <Button 
                    onClick={handleInterrupt}
                    size="lg"
                    className={`bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold text-xl px-12 py-6 transform hover:scale-110 transition-all duration-200 animate-pulse hover:animate-none shadow-lg shadow-yellow-500/25`}
                  >
                    <Zap className="h-6 w-6 mr-3" />
                    INTERRUPT NOW!
                    <Zap className="h-6 w-6 ml-3" />
                  </Button>
                  <p className="text-slate-400 text-sm mt-3">Click when you hear something questionable!</p>
                </div>
              </CardContent>
            </Card>

            {/* Waiting Speaker */}
            <Card className={`bg-slate-800/30 border-slate-700/50 backdrop-blur-sm opacity-60 hover:opacity-80 transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="text-3xl grayscale">{otherSpeaker.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-300 font-serif">{otherSpeaker.name}</h3>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-400">WAITING</Badge>
                    </div>
                    <p className="text-slate-400 text-sm italic">Listening intently, preparing counter-argument...</p>
                  </div>
                  <div className="text-slate-500">
                    <div className="w-3 h-3 bg-slate-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* Interrupt Power */}
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                  Interrupt Power
                </h3>
                
                <div className="relative">
                  <div className="w-full bg-slate-700 rounded-full h-4 mb-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${interruptPower}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <span className="text-2xl font-bold text-yellow-400">{interruptPower}%</span>
                    <p className="text-slate-400 text-xs">Higher power = Better timing</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Challenges */}
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">⚡ Quick Challenges</h3>
                <div className="space-y-2">
                  {[
                    "What do you mean by that?",
                    "Can you give an example?",
                    "How do you know that's true?",
                    "What if someone disagreed?"
                  ].map((challenge, index) => (
                    <Button
                      key={index}
                      onClick={handleInterrupt}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white text-xs"
                    >
                      "{challenge}"
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Battle Stats */}
            <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">📊 Live Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Your Challenges:</span>
                    <span className="text-yellow-400 font-bold">{challengeCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Success Rate:</span>
                    <span className="text-green-400 font-bold">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Socratic Points:</span>
                    <span className="text-purple-400 font-bold">{challengeCount * 15}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
