
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
        assistantId: "YOUR_MORALITY_ASSISTANT_ID", // Replace with your actual assistant ID
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
        assistantId: "YOUR_FREEWILL_ASSISTANT_ID", // Replace with your actual assistant ID
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
      // Add moderator expression
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
      // Show error if API key is not configured
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
            <Badge className={`${isConnected ? 'bg-green-500 hover:bg-green-600' : isLoading ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-red-500 hover:bg-red-600'} text-white animate-pulse`}>
              {isConnected ? '🟢 CONNECTED' : isLoading ? '🟡 CONNECTING' : '🔴 DISCONNECTED'}
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

          {/* Participants Overview with Moderator in Center */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-white mb-4 text-center">Debate Participants</h3>
            
            {/* Triangular Layout: Moderator at top, philosophers below */}
            <div className="flex flex-col items-center gap-6">
              {/* Moderator at top center */}
              <div className="w-full max-w-md">
                <div className={`bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${currentSpeaker === 'moderator' ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-700/30'}`}>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">⚖️</div>
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 ${currentSpeaker === 'moderator' ? 'justify-center' : ''}`}>
                        <h4 className="font-bold text-white">{debateConfig.moderator.name}</h4>
                        {currentSpeaker === 'moderator' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                            MODERATING
                          </Badge>
                        )}
                      </div>
                      <p className={`text-slate-400 text-sm mb-2 ${currentSpeaker === 'moderator' ? 'text-center' : ''}`}>{debateConfig.moderator.subtitle}</p>
                      {currentSpeaker !== 'moderator' && (
                        <p className="text-slate-300 text-xs italic">
                          {philosopherExpressions[debateConfig.moderator.name] || "maintaining order"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Philosophers below in a row */}
              <div className="grid md:grid-cols-2 gap-4 w-full">
                {debateConfig.philosophers.map((philosopher, index) => {
                  const isActive = currentSpeaker === 'philosopher1' && index === 0 || currentSpeaker === 'philosopher2' && index === 1;
                  return (
                    <div key={philosopher.name} className={`bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${isActive ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' : 'border-slate-700/30'}`}>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {philosopher.color === 'emerald' && '💭'}
                          {philosopher.color === 'red' && '🔥'}
                          {philosopher.color === 'blue' && '🧠'}
                          {philosopher.color === 'purple' && '⚡'}
                        </div>
                        <div className="flex-1">
                          <div className={`flex items-center gap-2 ${isActive ? 'justify-center' : ''}`}>
                            <h4 className="font-bold text-white">{philosopher.name}</h4>
                            {isActive && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                SPEAKING
                              </Badge>
                            )}
                          </div>
                          <p className={`text-slate-400 text-sm mb-2 ${isActive ? 'text-center' : ''}`}>{philosopher.subtitle}</p>
                          {!isActive && (
                            <p className="text-slate-300 text-xs italic">
                              {philosopherExpressions[philosopher.name] || "pondering existence"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fixed Height Speech Container */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="text-3xl">
                  {activeParticipant?.color === 'emerald' && '💭'}
                  {activeParticipant?.color === 'red' && '🔥'}
                  {activeParticipant?.color === 'blue' && '🧠'}
                  {activeParticipant?.color === 'purple' && '⚡'}
                  {activeParticipant?.color === 'amber' && '⚖️'}
                  {currentSpeaker === 'moderator' && '⚖️'}
                </div>
                <h2 className="text-2xl font-bold text-white font-serif">
                  {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
                </h2>
              </div>
              <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                {activeParticipant?.subtitle || 'The Moderator'}
              </Badge>
            </div>
            
            {/* Fixed Height Speech Container - 300px minimum height */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 h-80 flex items-center justify-center">
              <div className="text-center max-w-3xl">
                <p className="text-slate-200 text-xl leading-relaxed italic mb-6">
                  "{currentStatement}"
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400">Speaking...</span>
                </div>
              </div>
            </div>
            
            {/* Voice Control Button */}
            <div className="text-center mb-8">
              <Button 
                onClick={handleMuteToggle} 
                size="lg" 
                disabled={!isConnected}
                className={`relative font-bold text-xl px-12 py-6 rounded-2xl backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg ${
                  isUserMuted 
                    ? 'bg-gradient-to-r from-red-600/20 via-red-500/20 to-orange-500/20 hover:from-red-600/30 hover:via-red-500/30 hover:to-orange-500/30 border border-red-500/30 hover:border-red-400/40 text-red-300 hover:text-red-200 hover:shadow-red-500/10' 
                    : 'bg-gradient-to-r from-green-600/20 via-green-500/20 to-emerald-500/20 hover:from-green-600/30 hover:via-green-500/30 hover:to-emerald-500/30 border border-green-500/30 hover:border-green-400/40 text-green-300 hover:text-green-200 hover:shadow-green-500/10'
                } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className={`absolute inset-0 rounded-2xl blur-sm ${
                  isUserMuted ? 'bg-gradient-to-r from-red-600/10 to-orange-500/10' : 'bg-gradient-to-r from-green-600/10 to-emerald-500/10'
                }`}></div>
                <div className="relative flex items-center">
                  {isUserMuted ? (
                    <>
                      <MicOff className="h-6 w-6 mr-3 animate-pulse" />
                      UNMUTE TO SPEAK
                    </>
                  ) : (
                    <>
                      <Mic className="h-6 w-6 mr-3 animate-pulse" />
                      YOU'RE LIVE - SPEAK NOW
                    </>
                  )}
                </div>
              </Button>
              <p className="text-slate-400 text-sm mt-3">
                {error 
                  ? 'Setup required: Configure your Vapi Public Key and Assistant ID' 
                  : !isConnected 
                    ? 'Connecting to voice debate...' 
                    : isUserMuted 
                      ? 'Click to join the debate with your voice' 
                      : 'You can now speak directly to the philosophers'
                }
              </p>
            </div>
          </div>

          {/* Expandable Live Transcript */}
          {transcript.length > 0 && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white font-serif">LIVE DEBATE TRANSCRIPT</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                    className="text-slate-400 hover:text-white"
                  >
                    {isTranscriptExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                  Real-time conversation
                </Badge>
              </div>
              
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/30">
                <ScrollArea className={`${isTranscriptExpanded ? 'h-96' : 'h-48'} transition-all duration-300`}>
                  <div className="space-y-4 pr-4">
                    {transcript.map((message, index) => (
                      <div key={index} className="border-l-2 border-slate-600/30 pl-4">
                        <p className="text-slate-200 leading-relaxed">
                          {message}
                        </p>
                      </div>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>
                </ScrollArea>
                
                <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-slate-700/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 text-sm">Live conversation in progress...</span>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Socratic Challenge Toolkit */}
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-white mb-2">💭 Socratic Challenge Toolkit</h3>
              <p className="text-slate-400 text-sm">Quick challenges to get you started</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex gap-1">
                  {socraticChallenges.map((_, index) => (
                    <div 
                      key={index} 
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentChallengeSet ? 'bg-blue-400' : 'bg-slate-600'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid md:grid-cols-2 gap-3 mb-4">
                {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickChallenge(suggestion)}
                    disabled={!isConnected}
                    className={`p-4 rounded-xl bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white text-sm transition-all duration-200 hover:scale-105 border border-slate-600/20 hover:border-slate-500/40 backdrop-blur-sm hover:shadow-lg ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
              
              <div className="flex justify-center gap-3">
                <Button 
                  onClick={prevChallengeSet} 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  onClick={nextChallengeSet} 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-xl"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
