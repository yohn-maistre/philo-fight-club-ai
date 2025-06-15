
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Square, Clock, Target, Zap } from "lucide-react";
import { InterruptInterface } from "@/components/InterruptInterface";
import { LiveTracker } from "@/components/LiveTracker";
import { PhilosopherResponse } from "@/components/PhilosopherResponse";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

export const DebateArena = ({ debateId, onBack }: DebateArenaProps) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<'nietzsche' | 'socrates' | 'user'>('nietzsche');
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [challengeCount, setChallengeCount] = useState(0);
  const [debateTime, setDebateTime] = useState(754); // seconds
  const [currentStatement, setCurrentStatement] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // Sample philosophical statements
  const statements = {
    nietzsche: [
      "Your precious 'objective morality' is nothing but the bleating of weak souls who lack the courage to create their own values! The Übermensch transcends such slave morality and—",
      "What you call 'good' and 'evil' are merely human constructions, created by those too cowardly to embrace their own power! True strength lies in—",
      "The masses cling to their moral absolutes because they fear the terrifying freedom of creating meaning for themselves! But the strong individual—"
    ],
    socrates: [
      "But my dear friend, before we can discuss whether morality is objective, shouldn't we first examine what we mean by 'morality' itself? For how can we—",
      "You speak of strength and weakness, but I confess I do not understand these terms. What makes one soul stronger than another? Is it not possible that—",
      "Perhaps you are right, but I wonder... if there are no universal moral truths, then how can we say that creating one's own values is better than accepting traditional ones? For to say it is 'better' seems to imply—"
    ]
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setDebateTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isInterrupted && !showResponse) {
      const speaker = currentSpeaker === 'nietzsche' ? 'nietzsche' : 'socrates';
      const speakerStatements = statements[speaker];
      setCurrentStatement(speakerStatements[Math.floor(Math.random() * speakerStatements.length)]);
    }
  }, [currentSpeaker, isInterrupted, showResponse]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInterrupt = () => {
    setIsInterrupted(true);
    setCurrentSpeaker('user');
  };

  const handleChallengeComplete = (challenge: string) => {
    setChallengeCount(prev => prev + 1);
    setIsInterrupted(false);
    setShowResponse(true);
  };

  const handleContinueDebate = () => {
    setShowResponse(false);
    setCurrentSpeaker(currentSpeaker === 'nietzsche' ? 'socrates' : 'nietzsche');
  };

  if (isInterrupted) {
    return (
      <InterruptInterface
        philosopher={currentSpeaker === 'nietzsche' ? 'Nietzsche' : 'Socrates'}
        onChallengeComplete={handleChallengeComplete}
        onBack={() => setIsInterrupted(false)}
      />
    );
  }

  if (showResponse) {
    return (
      <PhilosopherResponse
        philosopher={currentSpeaker === 'nietzsche' ? 'Nietzsche' : 'Socrates'}
        onContinue={handleContinueDebate}
        onNewChallenge={() => setIsInterrupted(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Arena
          </Button>
          
          <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
            🔴 LIVE DEBATE
          </Badge>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 font-serif">🥊 Philosophy Fight Club - Live Arena</h1>
          <p className="text-slate-300 text-lg mb-4">Topic: "Is morality objective or subjective?"</p>
          
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Debate Time: {formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Your Challenges: {challengeCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Speaking Area */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">{currentSpeaker === 'nietzsche' ? '🔥' : '💭'}</div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {currentSpeaker === 'nietzsche' ? 'NIETZSCHE' : 'SOCRATES'} SPEAKING:
                  </h3>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {currentSpeaker === 'nietzsche' ? 'The Hammer of Philosophy' : 'The Great Questioner'}
                </Badge>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4 mb-6 min-h-[120px]">
                <p className="text-slate-200 text-lg leading-relaxed italic">
                  "{currentStatement}"
                </p>
                <div className="flex items-center mt-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-slate-400 text-sm">Speaking...</span>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleInterrupt}
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg px-8 py-4 animate-pulse hover:animate-none transform hover:scale-105 transition-all"
                >
                  <Zap className="h-5 w-5 mr-2" />
                  INTERRUPT NOW!
                </Button>
                <p className="text-slate-400 text-sm mt-2">Click to challenge their logic</p>
              </div>
            </CardContent>
          </Card>

          {/* Socratic Challenger Toolkit */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl">💭</div>
                <h3 className="text-lg font-bold text-white">SOCRATIC CHALLENGER TOOLKIT</h3>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚡ INTERRUPT SUGGESTIONS:</h4>
                <div className="space-y-2">
                  {[
                    "But what do you mean by 'weak'?",
                    "Can you give a concrete example?", 
                    "Isn't that just your opinion?",
                    "What about this counter-example..."
                  ].map((suggestion, index) => (
                    <button 
                      key={index}
                      onClick={handleInterrupt}
                      className="block w-full text-left p-2 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors"
                    >
                      • "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">🎯 YOUR CUSTOM CHALLENGE:</h4>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Type your philosophical challenge..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
                  />
                  <Button 
                    onClick={handleInterrupt}
                    className="bg-yellow-600 hover:bg-yellow-500 text-white"
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Tracker Sidebar */}
        <div className="lg:col-span-1">
          <LiveTracker 
            socrates={{ questions: 7, gotcha: 2 }}
            nietzsche={{ assertions: 15, fallacies: 3 }}
            moderator={{ questionsAsked: 12, stumpedMoments: 1 }}
          />
        </div>
      </div>
    </div>
  );
};
