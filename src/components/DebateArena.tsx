import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Mic, MicOff, Clock, Target, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import { useToast } from "@/hooks/use-toast";
import { ArenaBackground } from "@/components/ArenaBackground";
import { SpeakingPlatform } from "@/components/SpeakingPlatform";
import { CircularParticipants } from "@/components/CircularParticipants";
import { LoadingScreen } from "@/components/LoadingScreen";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

// Move expressions outside component to prevent recreation on every render
const absurdExpressions = ["adjusting his toga dramatically", "counting invisible sheep", "practicing air guitar solos", "doing tiny desk push-ups", "organizing his beard hair by length", "sketching doodles of cats", "humming show tunes quietly", "tapping morse code with his fingers", "doing interpretive dance moves", "practicing magic tricks", "folding origami cranes", "shadow boxing with wisdom", "playing invisible chess", "conducting an invisible orchestra", "doing breathing exercises", "stretching like a cat", "swinging his feet while listening", "sitting grumpily with arms crossed", "twirling his mustache thoughtfully", "cleaning his fingernails", "stacking imaginary blocks", "doing neck rolls", "practicing facial expressions in a mirror", "knitting an invisible scarf"];

export const DebateArena = ({ debateId, onBack }: DebateArenaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState<'philosopher1' | 'philosopher2' | 'moderator' | 'user'>('moderator');
  const [challengeCount, setChallengeCount] = useState(0);
  const [debateTime, setDebateTime] = useState(0);
  const [currentStatement, setCurrentStatement] = useState("");
  const [philosopherExpressions, setPhilosopherExpressions] = useState<{[key: string]: string}>({});
  const [currentChallengeSet, setCurrentChallengeSet] = useState(0);
  const [isUserMuted, setIsUserMuted] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [isTranscriptExpanded, setIsTranscriptExpanded] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Vapi integration with improved message handling
  const { isConnected, isLoading: vapiLoading, error, connect, disconnect, sendMessage } = useVapi({
    onConnect: () => {
      console.log('Connected to Vapi');
      setTranscript(prev => [...prev, 'System: Connected to voice debate']);
      toast({
        title: "Connected",
        description: "Voice debate connection established",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from Vapi');
      setTranscript(prev => [...prev, 'System: Disconnected from voice debate']);
    },
    onMessage: (message) => {
      console.log('Received message from Vapi:', message);
      if (message.transcript) {
        const speaker = message.transcript.speaker === 'user' ? 'You' : 'AI Philosopher';
        setTranscript(prev => [...prev, `${speaker}: ${message.transcript!.transcript}`]);
      }
    },
    onError: (error) => {
      console.error('Vapi error:', error);
      setTranscript(prev => [...prev, `System: Error - ${error.message || 'Connection failed'}`]);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect to voice debate",
        variant: "destructive",
      });
    }
  });

  // Get debate config based on ID
  const getDebateConfig = (id: string) => {
    const configs = {
      "morality-debate": {
        title: "The Morality Clash",
        topic: "Is morality objective or subjective?",
        assistantId: "YOUR_MORALITY_ASSISTANT_ID",
        philosophers: [{
          name: "Socrates",
          color: "emerald",
          subtitle: "The Questioner"
        }, {
          name: "Nietzsche",
          color: "red",
          subtitle: "The Hammer"
        }],
        moderator: {
          name: "Aristotle",
          color: "blue",
          subtitle: "The Moderator"
        },
        statements: {
          philosopher1: ["Before we can discuss whether morality is objective, shouldn't we first examine what we mean by 'morality' itself? For how can we—", "You speak of strength and weakness, but I confess I do not understand these terms. What makes one soul stronger than another? Is it not possible that—", "Perhaps you are right, but I wonder... if there are no universal moral truths, then how can we say that creating one's own values is better than accepting traditional ones? For to say it is 'better' seems to imply—"],
          philosopher2: ["Your precious 'objective morality' is nothing but the bleating of weak souls who lack the courage to create their own values! The Übermensch transcends such slave morality and—", "What you call 'good' and 'evil' are merely human constructions, created by those too cowardly to embrace their own power! True strength lies in—", "The masses cling to their moral absolutes because they fear the terrifying freedom of creating meaning for themselves! But the strong individual—"],
          moderator: ["Welcome to today's philosophical debate on the nature of morality. Let us begin by establishing our fundamental positions...", "An interesting point has been raised. Let us explore this further before moving to our next consideration...", "I believe we should now turn our attention to the implications of what has been discussed..."]
        }
      },
      "free-will-debate": {
        title: "The Freedom Fight",
        topic: "Do we have free will or are we determined?",
        assistantId: "YOUR_FREEWILL_ASSISTANT_ID",
        philosophers: [{
          name: "Descartes",
          color: "blue",
          subtitle: "The Dualist"
        }, {
          name: "Spinoza",
          color: "purple",
          subtitle: "The Determinist"
        }],
        moderator: {
          name: "Kant",
          color: "amber",
          subtitle: "The Synthesizer"
        },
        statements: {
          philosopher1: ["I think, therefore I am - and in this thinking, I discover my freedom to doubt, to affirm, to deny. The mind is distinct from matter and—", "But surely you must see that the very act of reasoning demonstrates our freedom? When I choose to doubt or to believe, this choice itself—", "The will is infinite in scope, though the understanding is finite. This is why error occurs - when the will extends beyond what the understanding—"],
          philosopher2: ["All things are determined by the necessity of divine nature to exist and operate in a certain way. What you call 'free will' is merely—", "Men believe themselves free because they are conscious of their desires but ignorant of the causes that determine them. Every action follows—", "The mind's power is defined by its power of action. When we understand the causes that determine us, we achieve a higher form of freedom through—"],
          moderator: ["Today we examine the fundamental question of human agency and determination...", "Let us carefully consider the implications of these opposing viewpoints...", "Perhaps we might find a synthesis between these seemingly contradictory positions..."]
        }
      }
    };
    return configs[id as keyof typeof configs] || configs["morality-debate"];
  };

  const debateConfig = getDebateConfig(debateId);

  // Update expressions every 3-5 seconds
  useEffect(() => {
    const updateExpressions = () => {
      const newExpressions: {[key: string]: string} = {};
      debateConfig.philosophers.forEach(philosopher => {
        const randomExpression = absurdExpressions[Math.floor(Math.random() * absurdExpressions.length)];
        newExpressions[philosopher.name] = randomExpression;
      });
      const randomExpression = absurdExpressions[Math.floor(Math.random() * absurdExpressions.length)];
      newExpressions[debateConfig.moderator.name] = randomExpression;
      setPhilosopherExpressions(newExpressions);
    };

    updateExpressions();
    const interval = setInterval(() => {
      updateExpressions();
    }, Math.random() * 2000 + 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setDebateTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const speaker = currentSpeaker;
    const statements = debateConfig.statements[speaker];
    if (statements) {
      setCurrentStatement(statements[Math.floor(Math.random() * statements.length)]);
    }
  }, [currentSpeaker, debateConfig]);

  // Initialize Vapi connection with assistant ID
  useEffect(() => {
    const assistantId = debateConfig.assistantId;
    
    if (assistantId && assistantId !== "YOUR_MORALITY_ASSISTANT_ID" && assistantId !== "YOUR_FREEWILL_ASSISTANT_ID") {
      connect(assistantId);
    } else if (error) {
      toast({
        title: "Setup Required",
        description: "Please configure your Vapi Public Key and Assistant ID",
        variant: "destructive",
      });
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, debateConfig, error, toast]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen message="Preparing the philosophical arena..." />;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    setIsUserMuted(!isUserMuted);
    if (!isUserMuted) {
      setChallengeCount(prev => prev + 1);
    }
  };

  const handleQuickChallenge = (challenge: string) => {
    setChallengeCount(prev => prev + 1);
    setTranscript(prev => [...prev, `You: ${challenge}`]);
    sendMessage(challenge);
  };

  const nextChallengeSet = () => {
    setCurrentChallengeSet(prev => (prev + 1) % socraticChallenges.length);
  };

  const prevChallengeSet = () => {
    setCurrentChallengeSet(prev => (prev - 1 + socraticChallenges.length) % socraticChallenges.length);
  };

  // Get active participant info
  const getActiveParticipant = () => {
    if (currentSpeaker === 'philosopher1') return debateConfig.philosophers[0];
    if (currentSpeaker === 'philosopher2') return debateConfig.philosophers[1];
    if (currentSpeaker === 'moderator') return debateConfig.moderator;
    return null;
  };

  const activeParticipant = getActiveParticipant();

  // Extended Socratic challenge suggestions
  const socraticChallenges = [
    ["But what do you mean by that?", "Can you give a concrete example?", "What if someone disagreed?", "How do you know that's true?"],
    ["What assumptions are you making?", "Could there be another explanation?", "What evidence supports this?", "How would you respond to critics?"],
    ["What are the implications of that?", "Is this always the case?", "What would happen if everyone believed this?", "How do you define that term?"],
    ["What's the strongest argument against your view?", "Where does this logic lead us?", "Can you think of any exceptions?", "Why should we accept this premise?"],
    ["What would your opponents say?", "How did you reach that conclusion?", "What if the opposite were true?", "What's your best evidence for this?"]
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Arena Background with Atmosphere */}
      <ArenaBackground />
      
      {/* Clean Modern Header */}
      <div className="relative z-10 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Arena
          </Button>
          
          <div className="flex items-center gap-6 text-slate-400">
            <div className="flex items-center gap-2 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/30">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/30 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/30">
              <Target className="h-4 w-4" />
              <span>{challengeCount} challenges</span>
            </div>
            <Badge className={`${isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : vapiLoading ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} backdrop-blur-sm`}>
              {isConnected ? '🟢 LIVE' : vapiLoading ? '🟡 CONNECTING' : '🔴 OFFLINE'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Arena Content - Modernized Layout */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Clean Arena Title */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="text-5xl mb-3">🏛️</div>
              <h1 className="text-4xl font-bold text-white mb-2 font-serif tracking-wide">
                {debateConfig.title}
              </h1>
              <p className="text-slate-300 text-lg font-serif italic mb-4">
                "{debateConfig.topic}"
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-full backdrop-blur-sm">
                <span className="text-yellow-400 font-medium text-sm">PHILOSOPHICAL ARENA</span>
              </div>
            </div>
          </div>

          {/* Circular Participants - More Spacious */}
          <div className="mb-16">
            <CircularParticipants 
              currentSpeaker={currentSpeaker}
              debateConfig={debateConfig}
              philosopherExpressions={philosopherExpressions}
            />
          </div>

          {/* Central Speaking Platform - Enhanced */}
          <div className="mb-16 flex justify-center">
            <SpeakingPlatform 
              currentSpeaker={currentSpeaker}
              activeParticipant={activeParticipant}
              currentStatement={currentStatement}
            />
          </div>
            
          {/* Modern Voice Control */}
          <div className="text-center mb-12">
            <Button 
              onClick={handleMuteToggle} 
              size="lg" 
              disabled={!isConnected}
              className={`relative font-semibold text-lg px-10 py-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-2xl ${
                isUserMuted 
                  ? 'bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 hover:from-slate-600/60 hover:via-slate-500/60 hover:to-slate-600/60 border-2 border-slate-500/30 hover:border-slate-400/40 text-slate-200 hover:text-white' 
                  : 'bg-gradient-to-r from-emerald-600/40 via-emerald-500/40 to-green-500/40 hover:from-emerald-600/50 hover:via-emerald-500/50 hover:to-green-500/50 border-2 border-emerald-500/40 hover:border-emerald-400/50 text-emerald-100 hover:text-white shadow-emerald-500/25'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                {isUserMuted ? (
                  <>
                    <MicOff className="h-5 w-5" />
                    Join Debate
                  </>
                ) : (
                  <>
                    <Mic className="h-5 w-5 animate-pulse" />
                    Speaking Live
                  </>
                )}
              </div>
            </Button>
            <p className="text-slate-400 text-sm mt-4 max-w-md mx-auto">
              {error 
                ? 'Voice system requires setup - Configure your Vapi credentials' 
                : !isConnected 
                  ? 'Establishing voice connection...' 
                  : isUserMuted 
                    ? 'Click to join the philosophical debate with your voice' 
                    : 'You are now participating in the live debate'
              }
            </p>
          </div>

          {/* Clean Transcript Section */}
          {transcript.length > 0 && (
            <div className="mb-12">
              <div className="bg-slate-900/40 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <h3 className="text-xl font-semibold text-white">Live Transcript</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                    className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl"
                  >
                    {isTranscriptExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <ScrollArea className={`${isTranscriptExpanded ? 'h-80' : 'h-48'} transition-all duration-300`}>
                  <div className="space-y-3 pr-4">
                    {transcript.map((message, index) => (
                      <div key={index} className="border-l-2 border-slate-600/20 pl-4 py-2">
                        <p className="text-slate-200 leading-relaxed text-sm">
                          {message}
                        </p>
                      </div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Modern Challenge Toolkit */}
          <div className="bg-slate-900/30 backdrop-blur-sm rounded-3xl p-8 border border-slate-700/20 shadow-xl">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="text-2xl">💭</div>
                <h3 className="text-2xl font-bold text-white">Socratic Arsenal</h3>
              </div>
              <p className="text-slate-400">Quick philosophical challenges to elevate the debate</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                {socraticChallenges.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentChallengeSet ? 'bg-yellow-400' : 'bg-slate-600'
                    }`} 
                  />
                ))}
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickChallenge(suggestion)}
                  disabled={!isConnected}
                  className={`p-5 rounded-2xl bg-slate-800/40 hover:bg-slate-700/50 text-slate-300 hover:text-white text-sm transition-all duration-200 hover:scale-[1.02] border border-slate-600/20 hover:border-slate-500/30 backdrop-blur-sm ${!isConnected ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
                >
                  <span className="text-yellow-400 mr-2">"</span>
                  {suggestion}
                  <span className="text-yellow-400 ml-2">"</span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-center gap-4">
              <Button 
                onClick={prevChallengeSet} 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl border border-slate-600/20"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button 
                onClick={nextChallengeSet} 
                variant="ghost" 
                size="sm" 
                className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl border border-slate-600/20"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
