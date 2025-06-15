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
export const DebateArena = ({
  debateId,
  onBack
}: DebateArenaProps) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<'philosopher1' | 'philosopher2' | 'user'>('philosopher1');
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [challengeCount, setChallengeCount] = useState(0);
  const [debateTime, setDebateTime] = useState(0);
  const [currentStatement, setCurrentStatement] = useState("");
  const [showResponse, setShowResponse] = useState(false);

  // Get debate config based on ID
  const getDebateConfig = (id: string) => {
    const configs = {
      "morality-debate": {
        title: "The Morality Clash",
        topic: "Is morality objective or subjective?",
        philosophers: [{
          name: "Socrates",
          color: "emerald",
          subtitle: "The Questioner"
        }, {
          name: "Nietzsche",
          color: "red",
          subtitle: "The Hammer"
        }],
        statements: {
          philosopher1: ["Before we can discuss whether morality is objective, shouldn't we first examine what we mean by 'morality' itself? For how can we—", "You speak of strength and weakness, but I confess I do not understand these terms. What makes one soul stronger than another? Is it not possible that—", "Perhaps you are right, but I wonder... if there are no universal moral truths, then how can we say that creating one's own values is better than accepting traditional ones? For to say it is 'better' seems to imply—"],
          philosopher2: ["Your precious 'objective morality' is nothing but the bleating of weak souls who lack the courage to create their own values! The Übermensch transcends such slave morality and—", "What you call 'good' and 'evil' are merely human constructions, created by those too cowardly to embrace their own power! True strength lies in—", "The masses cling to their moral absolutes because they fear the terrifying freedom of creating meaning for themselves! But the strong individual—"]
        }
      },
      "free-will-debate": {
        title: "The Freedom Fight",
        topic: "Do we have free will or are we determined?",
        philosophers: [{
          name: "Descartes",
          color: "blue",
          subtitle: "The Dualist"
        }, {
          name: "Spinoza",
          color: "purple",
          subtitle: "The Determinist"
        }],
        statements: {
          philosopher1: ["I think, therefore I am - and in this thinking, I discover my freedom to doubt, to affirm, to deny. The mind is distinct from matter and—", "But surely you must see that the very act of reasoning demonstrates our freedom? When I choose to doubt or to believe, this choice itself—", "The will is infinite in scope, though the understanding is finite. This is why error occurs - when the will extends beyond what the understanding—"],
          philosopher2: ["All things are determined by the necessity of divine nature to exist and operate in a certain way. What you call 'free will' is merely—", "Men believe themselves free because they are conscious of their desires but ignorant of the causes that determine them. Every action follows—", "The mind's power is defined by its power of action. When we understand the causes that determine us, we achieve a higher form of freedom through—"]
        }
      }
    };
    return configs[id as keyof typeof configs] || configs["morality-debate"];
  };
  const debateConfig = getDebateConfig(debateId);
  useEffect(() => {
    const timer = setInterval(() => {
      setDebateTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (!isInterrupted && !showResponse) {
      const speaker = currentSpeaker;
      const statements = debateConfig.statements[speaker];
      if (statements) {
        setCurrentStatement(statements[Math.floor(Math.random() * statements.length)]);
      }
    }
  }, [currentSpeaker, isInterrupted, showResponse, debateConfig]);
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
    setCurrentSpeaker(currentSpeaker === 'philosopher1' ? 'philosopher2' : 'philosopher1');
  };
  if (isInterrupted) {
    const activePhilosopher = currentSpeaker === 'philosopher1' ? debateConfig.philosophers[0] : debateConfig.philosophers[1];
    return <InterruptInterface philosopher={activePhilosopher.name} onChallengeComplete={handleChallengeComplete} onBack={() => setIsInterrupted(false)} />;
  }
  if (showResponse) {
    const activePhilosopher = currentSpeaker === 'philosopher1' ? debateConfig.philosophers[0] : debateConfig.philosophers[1];
    return <PhilosopherResponse philosopher={activePhilosopher.name} onContinue={handleContinueDebate} onNewChallenge={() => setIsInterrupted(true)} />;
  }
  const activePhilosopher = currentSpeaker === 'philosopher1' ? debateConfig.philosophers[0] : debateConfig.philosophers[1];
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Battles
          </Button>
          
          <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
            🔴 LIVE
          </Badge>
        </div>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2 font-serif">{debateConfig.title}</h1>
          <p className="text-slate-300 text-lg mb-4">"{debateConfig.topic}"</p>
          
          <div className="flex items-center justify-center gap-6 text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Time: {formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Challenges: {challengeCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* Main Speaking Area */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/40 border-slate-700/50 mb-6 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">
                    {activePhilosopher.color === 'emerald' && '💭'}
                    {activePhilosopher.color === 'red' && '🔥'}
                    {activePhilosopher.color === 'blue' && '🧠'}
                    {activePhilosopher.color === 'purple' && '⚡'}
                  </div>
                  <h3 className="text-lg font-bold text-white font-serif">
                    {activePhilosopher.name.toUpperCase()} SPEAKING:
                  </h3>
                </div>
                <Badge variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                  {activePhilosopher.subtitle}
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
                <Button onClick={handleInterrupt} size="lg" className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-lg px-8 py-4 hover:transform hover:scale-105 transition-all">
                  <Zap className="h-5 w-5 mr-2" />
                  INTERRUPT NOW!
                </Button>
                <p className="text-slate-400 text-sm mt-2">Challenge their logic with your question</p>
              </div>
            </CardContent>
          </Card>

          {/* Challenge Suggestions */}
          <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl">💭</div>
                <h3 className="text-lg font-bold text-white">Socratic Challenge Toolkit</h3>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">⚡ Quick Challenges:</h4>
                <div className="space-y-2">
                  {["But what do you mean by that?", "Can you give a concrete example?", "What if someone disagreed?", "How do you know that's true?"].map((suggestion, index) => <button key={index} onClick={handleInterrupt} className="block w-full text-left p-2 rounded bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white text-sm transition-colors">
                      "{suggestion}"
                    </button>)}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">🎯 Your Custom Challenge:</h4>
                <div className="flex gap-2">
                  <input type="text" placeholder="Type your philosophical challenge..." className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400" />
                  <Button onClick={handleInterrupt} className="bg-yellow-600 hover:bg-yellow-500 text-white">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Tracker Sidebar */}
        <div className="lg:col-span-1">
          <LiveTracker philosopher1={{
          name: debateConfig.philosophers[0].name,
          color: debateConfig.philosophers[0].color,
          points: 7,
          actions: 12
        }} philosopher2={{
          name: debateConfig.philosophers[1].name,
          color: debateConfig.philosophers[1].color,
          points: 8,
          actions: 15
        }} yourScore={{
          challenges: challengeCount,
          points: challengeCount * 15
        }} />
        </div>
      </div>
    </div>;
};