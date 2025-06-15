import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Mic, MicOff, Clock, Target, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import { useToast } from "@/hooks/use-toast";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

// Move expressions outside component to prevent recreation on every render
const absurdExpressions = ["adjusting his toga dramatically", "counting invisible sheep", "practicing air guitar solos", "doing tiny desk push-ups", "organizing his beard hair by length", "sketching doodles of cats", "humming show tunes quietly", "tapping morse code with his fingers", "doing interpretive dance moves", "practicing magic tricks", "folding origami cranes", "shadow boxing with wisdom", "playing invisible chess", "conducting an invisible orchestra", "doing breathing exercises", "stretching like a cat", "swinging his feet while listening", "sitting grumpily with arms crossed", "twirling his mustache thoughtfully", "cleaning his fingernails", "stacking imaginary blocks", "doing neck rolls", "practicing facial expressions in a mirror", "knitting an invisible scarf"];

export const DebateArena = ({ debateId, onBack }: DebateArenaProps) => {
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

  // Vapi integration with improved message handling
  const { isConnected, isLoading, error, connect, disconnect, sendMessage } = useVapi({
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
        const speaker = message.transcript.speaker === 'user' ? 'You' : getCurrentSpeakerName();
        setTranscript(prev => [...prev, `${speaker}: ${message.transcript!.transcript}`]);
        
        // Update current speaker based on transcript
        if (message.transcript.speaker !== 'user') {
          // Rotate speakers automatically for demo purposes
          const speakers: ('moderator' | 'philosopher1' | 'philosopher2')[] = ['moderator', 'philosopher1', 'philosopher2'];
          const currentIndex = speakers.indexOf(currentSpeaker as any);
          const nextSpeaker = speakers[(currentIndex + 1) % speakers.length];
          setCurrentSpeaker(nextSpeaker);
        }
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
          subtitle: "The Questioner",
          emoji: "💭",
          gradient: "from-emerald-500/20 to-teal-500/20"
        }, {
          name: "Nietzsche",
          color: "red",
          subtitle: "The Hammer",
          emoji: "🔥",
          gradient: "from-red-500/20 to-orange-500/20"
        }],
        moderator: {
          name: "Aristotle",
          color: "blue",
          subtitle: "The Moderator",
          emoji: "⚖️",
          gradient: "from-blue-500/20 to-cyan-500/20"
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
          subtitle: "The Dualist",
          emoji: "🧠",
          gradient: "from-blue-500/20 to-indigo-500/20"
        }, {
          name: "Spinoza",
          color: "purple",
          subtitle: "The Determinist",
          emoji: "⚡",
          gradient: "from-purple-500/20 to-violet-500/20"
        }],
        moderator: {
          name: "Kant",
          color: "amber",
          subtitle: "The Synthesizer",
          emoji: "⚖️",
          gradient: "from-amber-500/20 to-yellow-500/20"
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

  // Get current speaker name for transcription
  const getCurrentSpeakerName = () => {
    if (currentSpeaker === 'philosopher1') return debateConfig.philosophers[0].name;
    if (currentSpeaker === 'philosopher2') return debateConfig.philosophers[1].name;
    if (currentSpeaker === 'moderator') return debateConfig.moderator.name;
    return 'Unknown';
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Mobile-First Header */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-700/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white shrink-0">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center flex-1 min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-white font-serif truncate">{debateConfig.title}</h1>
            <p className="text-slate-400 text-xs sm:text-sm truncate">"{debateConfig.topic}"</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 text-slate-400 text-xs sm:text-sm shrink-0">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>{challengeCount}</span>
            </div>
            <Badge className={`${isConnected ? 'bg-green-500' : isLoading ? 'bg-yellow-500' : 'bg-red-500'} text-white text-xs px-2 py-1 shrink-0`}>
              {isConnected ? '🟢' : isLoading ? '🟡' : '🔴'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive Grid */}
      <div className="px-4 sm:px-6 py-4 h-[calc(100vh-80px)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          
          {/* Participants Section - Responsive */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <h3 className="text-xs font-bold text-white text-center mb-3 tracking-wider">DEBATE ARENA</h3>
            
            {/* Mobile: Horizontal scroll, Desktop: Vertical stack */}
            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
              
              {/* Moderator Card - New Design */}
              <div className={`min-w-[200px] lg:min-w-0 relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                currentSpeaker === 'moderator' 
                  ? 'border-amber-400/60 shadow-lg shadow-amber-500/20 scale-105' 
                  : 'border-slate-600/40'
              }`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${debateConfig.moderator.gradient} backdrop-blur-sm`}></div>
                <div className="relative p-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{debateConfig.moderator.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-white text-sm font-serif truncate">{debateConfig.moderator.name}</h4>
                      <Badge className="text-xs px-2 py-0.5 bg-slate-600/30 text-slate-300 mb-1">
                        {debateConfig.moderator.subtitle}
                      </Badge>
                      {currentSpeaker === 'moderator' && (
                        <Badge className="bg-green-500/20 text-green-400 text-xs animate-pulse">MODERATING</Badge>
                      )}
                    </div>
                  </div>
                  {currentSpeaker !== 'moderator' && (
                    <p className="text-slate-400 text-xs italic mt-2 truncate">
                      {philosopherExpressions[debateConfig.moderator.name] || "maintaining order"}
                    </p>
                  )}
                </div>
              </div>

              {/* Philosopher Cards - New Design */}
              {debateConfig.philosophers.map((philosopher, index) => {
                const isActive = (currentSpeaker === 'philosopher1' && index === 0) || (currentSpeaker === 'philosopher2' && index === 1);
                const colorMap = {
                  emerald: 'emerald-400',
                  red: 'red-400', 
                  blue: 'blue-400',
                  purple: 'purple-400'
                };
                const borderColor = colorMap[philosopher.color as keyof typeof colorMap] || 'blue-400';
                
                return (
                  <div key={philosopher.name} className={`min-w-[200px] lg:min-w-0 relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                    isActive 
                      ? `border-${borderColor}/60 shadow-lg shadow-${philosopher.color}-500/20 scale-105` 
                      : 'border-slate-600/40'
                  }`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${philosopher.gradient} backdrop-blur-sm`}></div>
                    <div className="relative p-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{philosopher.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white text-sm font-serif truncate">{philosopher.name}</h4>
                          <Badge className="text-xs px-2 py-0.5 bg-slate-600/30 text-slate-300 mb-1">
                            {philosopher.subtitle}
                          </Badge>
                          {isActive && (
                            <Badge className="bg-green-500/20 text-green-400 text-xs animate-pulse">SPEAKING</Badge>
                          )}
                        </div>
                      </div>
                      {!isActive && (
                        <p className="text-slate-400 text-xs italic mt-2 truncate">
                          {philosopherExpressions[philosopher.name] || "pondering existence"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Central Debate Area */}
          <div className="lg:col-span-6 order-2 lg:order-2 flex flex-col">
            {/* Current Speaker & Speech */}
            <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-4 flex flex-col min-h-0">
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="text-xl sm:text-2xl">
                    {activeParticipant?.emoji || '⚖️'}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-serif">
                    {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
                  </h2>
                </div>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                  {activeParticipant?.subtitle || 'The Moderator'}
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center min-h-0">
                <div className="text-center max-w-lg">
                  <p className="text-slate-200 text-sm sm:text-lg leading-relaxed italic mb-4">
                    "{currentStatement}"
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-400 text-sm">Speaking...</span>
                  </div>
                </div>
              </div>

              {/* Voice Control */}
              <div className="text-center mt-4">
                <Button 
                  onClick={handleMuteToggle} 
                  size="lg" 
                  disabled={!isConnected}
                  className={`font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-105 text-sm sm:text-base ${
                    isUserMuted 
                      ? 'bg-gradient-to-r from-red-600/20 to-orange-500/20 hover:from-red-600/30 hover:to-orange-500/30 border border-red-500/30 text-red-300' 
                      : 'bg-gradient-to-r from-green-600/20 to-emerald-500/20 hover:from-green-600/30 hover:to-emerald-500/30 border border-green-500/30 text-green-300'
                  } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUserMuted ? (
                    <>
                      <MicOff className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">UNMUTE TO SPEAK</span>
                      <span className="sm:hidden">UNMUTE</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2 animate-pulse" />
                      <span className="hidden sm:inline">YOU'RE LIVE</span>
                      <span className="sm:hidden">LIVE</span>
                    </>
                  )}
                </Button>
                <p className="text-slate-400 text-xs mt-2">
                  {error 
                    ? 'Setup required: Configure your Vapi keys' 
                    : !isConnected 
                      ? 'Connecting...' 
                      : isUserMuted 
                        ? 'Click to join the debate' 
                        : 'You can now speak to the philosophers'
                  }
                </p>
              </div>
            </div>

            {/* Quick Challenges - Mobile Responsive */}
            <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-slate-700/30">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-white">💭 Quick Challenges</h3>
                <div className="flex gap-1">
                  <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
                    <ChevronLeft className="h-3 w-3" />
                  </Button>
                  <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickChallenge(suggestion)}
                    disabled={!isConnected}
                    className={`p-2 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white text-xs transition-all duration-200 hover:scale-105 border border-slate-600/20 ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Transcript - Responsive */}
          <div className="lg:col-span-3 order-3 lg:order-3 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-white tracking-wider">LIVE TRANSCRIPT</h3>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold text-slate-300 truncate max-w-[100px]">{getCurrentSpeakerName()}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                  className="h-6 w-6 p-0 text-slate-400 lg:hidden"
                >
                  {isTranscriptExpanded ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            
            <div className={`flex-1 min-h-0 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-3 sm:p-4 border border-slate-700/30 flex flex-col ${
              isTranscriptExpanded ? 'fixed inset-4 z-50 lg:relative lg:inset-auto' : ''
            }`}>
              <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-3 pr-2">
                  {transcript.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                      Waiting for conversation to begin...
                    </div>
                  ) : (
                    transcript.map((message, index) => (
                      <div key={index} className="border-l-2 border-slate-600/30 pl-3">
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed break-words">
                          {message}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={transcriptEndRef} />
                </div>
              </ScrollArea>
              
              <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-slate-700/30 shrink-0">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-xs">Live conversation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
