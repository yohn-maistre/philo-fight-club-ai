import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Mic, MicOff, Clock, Target, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
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
  const [transcriptExpanded, setTranscriptExpanded] = useState(false);
  const [challengesExpanded, setChallengesExpanded] = useState(false);
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
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
        }, {
          name: "Nietzsche",
          color: "red",
          subtitle: "The Hammer",
          emoji: "🔥",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
        }],
        moderator: {
          name: "Moderator",
          color: "amber",
          subtitle: "The Great Questioner",
          emoji: "🤔",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face"
        },
        statements: {
          philosopher1: ["Before we can discuss whether morality is objective, shouldn't we first examine what we mean by 'morality' itself?", "You speak of strength and weakness, but I confess I do not understand these terms.", "Perhaps you are right, but I wonder... if there are no universal moral truths, then how can we say that creating one's own values is better?"],
          philosopher2: ["Your precious 'objective morality' is nothing but the bleating of weak souls who lack the courage to create their own values!", "What you call 'good' and 'evil' are merely human constructions, created by those too cowardly to embrace their own power!", "The masses cling to their moral absolutes because they fear the terrifying freedom of creating meaning for themselves!"],
          moderator: ["Welcome to today's philosophical debate on the nature of morality. Let us begin by establishing our fundamental positions...", "An interesting point has been raised. Let us explore this further before moving to our next consideration...", "I believe we should now turn our attention to the implications of what has been discussed..."]
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
    
    if (assistantId && assistantId !== "YOUR_MORALITY_ASSISTANT_ID") {
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

  // All participants for avatar strip
  const allParticipants = [
    { ...debateConfig.moderator, id: 'moderator', type: 'moderator' as const },
    { ...debateConfig.philosophers[0], id: 'philosopher1', type: 'philosopher' as const },
    { ...debateConfig.philosophers[1], id: 'philosopher2', type: 'philosopher' as const }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-orange-300 relative overflow-hidden">
      {/* Floating Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/20 backdrop-blur-xl rounded-full px-6 py-3 flex items-center gap-4 border border-white/10">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-white hover:bg-white/10 p-2 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-center">
            <h1 className="text-white font-bold text-lg font-serif">{debateConfig.title}</h1>
            <p className="text-white/80 text-xs">"{debateConfig.topic}"</p>
          </div>
          
          <div className="flex items-center gap-3 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{challengeCount}</span>
            </div>
            <Badge className={`${isConnected ? 'bg-green-500/30' : isLoading ? 'bg-yellow-500/30' : 'bg-red-500/30'} text-white border-0`}>
              {isConnected ? '🟢' : isLoading ? '🟡' : '🔴'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-8">
        
        {/* Current Speaker Card */}
        <div className="mb-12 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl mx-auto mb-4">
              <img
                src={activeParticipant?.avatar}
                alt={activeParticipant?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-6 border border-white/20 shadow-xl max-w-2xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-white font-serif mb-1">
                {activeParticipant?.name || 'Unknown'}
              </h2>
              <Badge className="bg-white/20 text-white border-0 text-sm">
                {activeParticipant?.subtitle || 'Speaker'}
              </Badge>
            </div>
            
            <p className="text-white/90 text-lg leading-relaxed italic mb-4">
              "{currentStatement}"
            </p>
            
            <div className="flex items-center justify-center gap-2 text-white/70">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Speaking now...</span>
            </div>
          </div>
        </div>

        {/* Participant Avatars Row */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {allParticipants.map((participant, index) => {
            const isActive = (currentSpeaker === participant.id);
            
            return (
              <div key={participant.id} className="relative">
                <div className={`w-16 h-16 rounded-full overflow-hidden border-3 transition-all duration-300 ${
                  isActive 
                    ? 'border-white shadow-2xl scale-110' 
                    : 'border-white/30 hover:border-white/50 hover:scale-105'
                }`}>
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name tooltip */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-medium whitespace-nowrap">
                      {participant.name}
                    </span>
                  </div>
                </div>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Voice Input */}
        <div className="mb-8">
          <div className="bg-black/20 backdrop-blur-xl rounded-full px-8 py-4 border border-white/10">
            <Button 
              onClick={handleMuteToggle} 
              size="lg" 
              disabled={!isConnected}
              className={`font-bold px-8 py-4 rounded-full transition-all duration-200 border-0 ${
                isUserMuted 
                  ? 'bg-white/20 hover:bg-white/30 text-white' 
                  : 'bg-green-500/30 hover:bg-green-500/40 text-white'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUserMuted ? (
                <>
                  <MicOff className="h-5 w-5 mr-2" />
                  TAP TO SPEAK
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2 animate-pulse" />
                  LISTENING...
                </>
              )}
            </Button>
          </div>
          <p className="text-white/70 text-sm mt-3 text-center">
            {error 
              ? 'Setup required: Configure your Vapi keys' 
              : !isConnected 
                ? 'Connecting to voice system...' 
                : isUserMuted 
                  ? 'Join the philosophical discussion' 
                  : 'Speak your mind to the great thinkers'
            }
          </p>
        </div>

        {/* Bottom Controls - Mobile Responsive */}
        <div className="w-full max-w-4xl space-y-4">
          {/* Quick Challenges */}
          <div className="lg:hidden">
            <button
              onClick={() => setChallengesExpanded(!challengesExpanded)}
              className="w-full bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between text-white"
            >
              <span className="font-medium">💭 Quick Challenges</span>
              {challengesExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {challengesExpanded && (
              <div className="mt-3 bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/80 text-sm">Choose your challenge:</span>
                  <div className="flex gap-2">
                    <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickChallenge(suggestion)}
                      disabled={!isConnected}
                      className={`w-full p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-200 border border-white/10 text-left ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Quick Challenges */}
          <div className="hidden lg:block">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">💭 Quick Challenges</h3>
                <div className="flex gap-2">
                  <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/10 rounded-full">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickChallenge(suggestion)}
                    disabled={!isConnected}
                    className={`p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm transition-all duration-200 border border-white/10 text-left ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div className="lg:hidden">
            <button
              onClick={() => setTranscriptExpanded(!transcriptExpanded)}
              className="w-full bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 flex items-center justify-between text-white"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">Live Transcript</span>
                <Badge className="bg-green-500/30 text-white border-0 text-xs">
                  {getCurrentSpeakerName()}
                </Badge>
              </div>
              {transcriptExpanded ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </button>
            
            {transcriptExpanded && (
              <div className="mt-3 bg-black/20 backdrop-blur-xl rounded-2xl p-4 border border-white/10 max-h-60">
                <ScrollArea className="h-52">
                  <div className="space-y-2 pr-2">
                    {transcript.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-white/60 text-sm">
                        Waiting for the debate to begin...
                      </div>
                    ) : (
                      transcript.map((message, index) => (
                        <div key={index} className="border-l-2 border-white/20 pl-3">
                          <p className="text-white/90 text-sm leading-relaxed break-words">
                            {message}
                          </p>
                        </div>
                      ))
                    )}
                    <div ref={transcriptEndRef} />
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>

          {/* Desktop Transcript */}
          <div className="hidden lg:block">
            <div className="bg-black/20 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-h-60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Live Transcript</h3>
                <Badge className="bg-green-500/30 text-white border-0 text-sm">
                  {getCurrentSpeakerName()}
                </Badge>
              </div>
              
              <ScrollArea className="h-48">
                <div className="space-y-2 pr-2">
                  {transcript.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-white/60 text-sm">
                      The philosophical discourse awaits...
                    </div>
                  ) : (
                    transcript.map((message, index) => (
                      <div key={index} className="border-l-2 border-white/20 pl-3">
                        <p className="text-white/90 text-sm leading-relaxed break-words">
                          {message}
                        </p>
                      </div>
                    ))
                  )}
                  <div ref={transcriptEndRef} />
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
