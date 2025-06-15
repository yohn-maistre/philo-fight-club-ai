
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Mic, MicOff, Clock, Target, ChevronLeft, ChevronRight, User, ChevronUp, ChevronDown } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import { useToast } from "@/hooks/use-toast";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

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
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
          emoji: "💭"
        }, {
          name: "Nietzsche",
          color: "red",
          subtitle: "The Hammer",
          emoji: "🔥"
        }],
        moderator: {
          name: "Socrates",
          color: "amber",
          subtitle: "The Great Questioner",
          emoji: "🤔"
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

  const getCurrentSpeakerName = () => {
    if (currentSpeaker === 'philosopher1') return debateConfig.philosophers[0].name;
    if (currentSpeaker === 'philosopher2') return debateConfig.philosophers[1].name;
    if (currentSpeaker === 'moderator') return debateConfig.moderator.name;
    return 'Unknown';
  };

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

  const getActiveParticipant = () => {
    if (currentSpeaker === 'philosopher1') return debateConfig.philosophers[0];
    if (currentSpeaker === 'philosopher2') return debateConfig.philosophers[1];
    if (currentSpeaker === 'moderator') return debateConfig.moderator;
    return null;
  };

  const activeParticipant = getActiveParticipant();

  const socraticChallenges = [
    ["But what do you mean by that?", "Can you give a concrete example?", "What if someone disagreed?", "How do you know that's true?"],
    ["What assumptions are you making?", "Could there be another explanation?", "What evidence supports this?", "How would you respond to critics?"],
    ["What are the implications of that?", "Is this always the case?", "What would happen if everyone believed this?", "How do you define that term?"],
    ["What's the strongest argument against your view?", "Where does this logic lead us?", "Can you think of any exceptions?", "Why should we accept this premise?"],
    ["What would your opponents say?", "How did you reach that conclusion?", "What if the opposite were true?", "What's your best evidence for this?"]
  ];

  const allParticipants = [
    { ...debateConfig.moderator, id: 'moderator', type: 'moderator' as const },
    { ...debateConfig.philosophers[0], id: 'philosopher1', type: 'philosopher' as const },
    { ...debateConfig.philosophers[1], id: 'philosopher2', type: 'philosopher' as const }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Floating Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 py-4">
        <div className="flex items-center justify-between backdrop-blur-xl bg-slate-900/20 rounded-2xl px-6 py-3 shadow-2xl">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl px-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          <div className="text-center flex-1 px-4">
            <h1 className="text-lg font-bold text-white font-serif truncate">{debateConfig.title}</h1>
            <p className="text-slate-400 text-sm truncate hidden sm:block">"{debateConfig.topic}"</p>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{challengeCount}</span>
            </div>
            <Badge className={`${isConnected ? 'bg-green-500/20 text-green-400 border-green-500/30' : isLoading ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} border`}>
              {isConnected ? 'LIVE' : isLoading ? 'CONNECTING' : 'OFFLINE'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 pb-8 px-4 min-h-screen flex flex-col">
        
        {/* Participant Avatars Row */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            {allParticipants.map((participant) => {
              const isActive = (currentSpeaker === participant.id);
              const colorMap = {
                emerald: 'from-emerald-500/20 to-emerald-600/20 border-emerald-400/40 text-emerald-300',
                red: 'from-red-500/20 to-red-600/20 border-red-400/40 text-red-300', 
                blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/40 text-blue-300',
                purple: 'from-purple-500/20 to-purple-600/20 border-purple-400/40 text-purple-300',
                amber: 'from-amber-500/20 to-amber-600/20 border-amber-400/40 text-amber-300'
              };
              const gradientClass = colorMap[participant.color as keyof typeof colorMap] || 'from-slate-500/20 to-slate-600/20 border-slate-400/40 text-slate-300';
              
              return (
                <div key={participant.id} className={`flex flex-col items-center transition-all duration-500 ${
                  isActive ? 'scale-110' : 'scale-100 opacity-70 hover:opacity-90'
                }`}>
                  <div className={`relative p-4 sm:p-6 rounded-full bg-gradient-to-br ${gradientClass} border backdrop-blur-sm ${
                    isActive ? 'shadow-2xl animate-pulse' : 'shadow-lg'
                  }`}>
                    <div className="text-3xl sm:text-4xl">
                      {participant.emoji}
                    </div>
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-3">
                    <div className="font-bold text-white text-sm sm:text-base font-serif">
                      {participant.name}
                    </div>
                    <div className="text-slate-400 text-xs">
                      {participant.subtitle}
                    </div>
                    {participant.type === 'moderator' && (
                      <Badge className="bg-amber-600/20 text-amber-400 border-amber-500/30 border text-xs mt-1">
                        MODERATOR
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Speaker Spotlight */}
        <div className="flex-1 flex flex-col justify-center mb-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif mb-2">
                {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
              </h2>
              <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50 border text-sm">
                {activeParticipant?.subtitle || 'The Great Questioner'}
              </Badge>
            </div>
            
            <div className="backdrop-blur-xl bg-white/5 rounded-3xl p-8 sm:p-12 mb-8 shadow-2xl">
              <p className="text-slate-200 text-lg sm:text-xl leading-relaxed italic mb-6">
                "{currentStatement}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-400 text-sm">Currently speaking...</span>
              </div>
            </div>

            {/* Voice Control */}
            <Button 
              onClick={handleMuteToggle} 
              size="lg" 
              disabled={!isConnected}
              className={`font-bold px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105 text-lg shadow-2xl ${
                isUserMuted 
                  ? 'bg-gradient-to-r from-red-600/20 to-orange-500/20 hover:from-red-600/30 hover:to-orange-500/30 border border-red-500/40 text-red-300' 
                  : 'bg-gradient-to-r from-green-600/20 to-emerald-500/20 hover:from-green-600/30 hover:to-emerald-500/30 border border-green-500/40 text-green-300'
              } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUserMuted ? (
                <>
                  <MicOff className="h-6 w-6 mr-3" />
                  JOIN THE DEBATE
                </>
              ) : (
                <>
                  <Mic className="h-6 w-6 mr-3 animate-pulse" />
                  YOU'RE LIVE
                </>
              )}
            </Button>
            <p className="text-slate-400 text-sm mt-4">
              {error 
                ? 'Setup required: Configure your Vapi keys' 
                : !isConnected 
                  ? 'Connecting to voice debate...' 
                  : isUserMuted 
                    ? 'Click to join the philosophical discussion' 
                    : 'Speak your mind to the great philosophers'
              }
            </p>
          </div>
        </div>

        {/* Quick Challenges */}
        <div className="mb-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">💭 Socratic Challenges</h3>
              <div className="flex gap-2">
                <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickChallenge(suggestion)}
                  disabled={!isConnected}
                  className={`p-4 rounded-xl bg-gradient-to-r from-slate-800/40 to-slate-700/40 hover:from-slate-700/50 hover:to-slate-600/50 text-slate-300 hover:text-white text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  "{suggestion}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Expandable Transcript */}
        <div className="max-w-4xl mx-auto w-full">
          <button
            onClick={() => setTranscriptExpanded(!transcriptExpanded)}
            className="w-full backdrop-blur-xl bg-slate-800/30 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800/40 transition-all duration-300 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-white">Live Transcript</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 border text-xs">
                {getCurrentSpeakerName()}
              </Badge>
            </div>
            {transcriptExpanded ? (
              <ChevronUp className="h-5 w-5 text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-slate-400" />
            )}
          </button>
          
          {transcriptExpanded && (
            <div className="mt-4 backdrop-blur-xl bg-slate-800/20 rounded-xl p-6 shadow-2xl">
              <ScrollArea className="h-64">
                <div className="space-y-3 pr-4">
                  {transcript.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400">
                      Waiting for the philosophical discussion to begin...
                    </div>
                  ) : (
                    transcript.map((message, index) => (
                      <div key={index} className="bg-slate-700/30 rounded-lg p-3 backdrop-blur-sm">
                        <p className="text-slate-200 text-sm leading-relaxed break-words">
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
      </div>
    </div>
  );
};
