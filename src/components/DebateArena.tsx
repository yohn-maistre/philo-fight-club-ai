import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mic, Clock, Target, Zap } from "lucide-react";
import { InterruptInterface } from "@/components/InterruptInterface";
import { PhilosopherResponse } from "@/components/PhilosopherResponse";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

// Move expressions outside component to prevent recreation on every render
const absurdExpressions = [
  "adjusting his toga dramatically",
  "counting invisible sheep",
  "practicing air guitar solos",
  "doing tiny desk push-ups",
  "organizing his beard hair by length",
  "sketching doodles of cats",
  "humming show tunes quietly",
  "tapping morse code with his fingers",
  "doing interpretive dance moves",
  "practicing magic tricks",
  "folding origami cranes",
  "shadow boxing with wisdom",
  "playing invisible chess",
  "conducting an invisible orchestra",
  "doing breathing exercises",
  "stretching like a cat",
  "swinging his feet while listening",
  "sitting grumpily with arms crossed",
  "twirling his mustache thoughtfully",
  "cleaning his fingernails",
  "stacking imaginary blocks",
  "doing neck rolls",
  "practicing facial expressions in a mirror",
  "knitting an invisible scarf"
];

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
  const [philosopherExpressions, setPhilosopherExpressions] = useState<{[key: string]: string}>({});

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

  // Update expressions every 3-5 seconds with proper cleanup
  useEffect(() => {
    const updateExpressions = () => {
      const newExpressions: {[key: string]: string} = {};
      debateConfig.philosophers.forEach(philosopher => {
        const randomExpression = absurdExpressions[Math.floor(Math.random() * absurdExpressions.length)];
        newExpressions[philosopher.name] = randomExpression;
      });
      setPhilosopherExpressions(newExpressions);
    };

    // Initial expressions
    updateExpressions();

    // Set up interval with random timing between 3-5 seconds
    const interval = setInterval(() => {
      updateExpressions();
    }, Math.random() * 2000 + 3000); // 3-5 seconds

    // Cleanup function
    return () => clearInterval(interval);
  }, []); // Empty dependency array - only run once on mount

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{challengeCount} challenges</span>
            </div>
            <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
              🔴 LIVE
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Debate Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">{debateConfig.title}</h1>
            <p className="text-slate-300 text-lg">"{debateConfig.topic}"</p>
          </div>

          {/* Speakers Overview */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Debate Participants</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {debateConfig.philosophers.map((philosopher, index) => {
                const isActive = (currentSpeaker === 'philosopher1' && index === 0) || (currentSpeaker === 'philosopher2' && index === 1);
                return (
                  <div key={philosopher.name} className={`bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' 
                      : 'border-slate-700/30'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {philosopher.color === 'emerald' && '💭'}
                        {philosopher.color === 'red' && '🔥'}
                        {philosopher.color === 'blue' && '🧠'}
                        {philosopher.color === 'purple' && '⚡'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white">{philosopher.name}</h4>
                          {isActive && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              SPEAKING
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{philosopher.subtitle}</p>
                        <p className="text-slate-300 text-xs italic">
                          {philosopherExpressions[philosopher.name] || "pondering existence"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Speaker Section */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-3xl">
                  {activePhilosopher.color === 'emerald' && '💭'}
                  {activePhilosopher.color === 'red' && '🔥'}
                  {activePhilosopher.color === 'blue' && '🧠'}
                  {activePhilosopher.color === 'purple' && '⚡'}
                </div>
                <h2 className="text-2xl font-bold text-white font-serif">
                  {activePhilosopher.name.toUpperCase()}
                </h2>
              </div>
              <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                {activePhilosopher.subtitle}
              </Badge>
            </div>
            
            {/* Fixed Height Speech Container */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <p className="text-slate-200 text-xl leading-relaxed italic mb-6 max-w-3xl">
                  "{currentStatement}"
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400">Speaking...</span>
                </div>
              </div>
            </div>
            
            {/* Interrupt Button */}
            <div className="text-center">
              <Button 
                onClick={handleInterrupt} 
                size="lg" 
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-bold text-xl px-12 py-6 rounded-2xl hover:transform hover:scale-105 transition-all shadow-lg hover:shadow-red-500/20"
              >
                <Zap className="h-6 w-6 mr-3" />
                INTERRUPT & CHALLENGE
              </Button>
              <p className="text-slate-400 text-sm mt-3">Challenge their logic with your Socratic question</p>
            </div>
          </div>

          {/* Quick Challenge Suggestions */}
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2">💭 Socratic Challenge Toolkit</h3>
              <p className="text-slate-400 text-sm">Quick challenges to get you started</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              {["But what do you mean by that?", "Can you give a concrete example?", "What if someone disagreed?", "How do you know that's true?"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={handleInterrupt}
                  className="p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 hover:text-white text-sm transition-all hover:transform hover:scale-105 border border-slate-600/20 hover:border-slate-500/40"
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
