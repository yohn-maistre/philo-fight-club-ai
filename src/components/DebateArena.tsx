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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Header - Mobile Optimized */}
      <div className="px-3 sm:px-4 py-3 border-b border-slate-700/30 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white p-2">
            <ArrowLeft className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          
          <div className="text-center flex-1 px-2">
            <h1 className="text-sm sm:text-lg font-bold text-white font-serif truncate">{debateConfig.title}</h1>
            <p className="text-slate-400 text-xs truncate hidden sm:block">"{debateConfig.topic}"</p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>{challengeCount}</span>
            </div>
            <Badge className={`${isConnected ? 'bg-green-500' : isLoading ? 'bg-yellow-500' : 'bg-red-500'} text-white text-xs px-1.5 py-0.5`}>
              {isConnected ? '🟢' : isLoading ? '🟡' : '🔴'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content - Mobile First Design */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Desktop Layout: Sidebar + Main */}
        <div className="hidden lg:flex flex-1 overflow-hidden">
          {/* Desktop Sidebar - Participants */}
          <div className="w-72 xl:w-80 flex-shrink-0 p-4 border-r border-slate-700/30 bg-slate-800/20">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white tracking-wider mb-4">PARTICIPANTS</h3>
              
              {/* Desktop Participant Cards */}
              <div className="space-y-3">
                {allParticipants.map((participant) => {
                  const isActive = (currentSpeaker === participant.id);
                  const colorMap = {
                    emerald: 'emerald-400',
                    red: 'red-400', 
                    blue: 'blue-400',
                    purple: 'purple-400',
                    amber: 'amber-400'
                  };
                  const borderColor = colorMap[participant.color as keyof typeof colorMap] || 'amber-400';
                  
                  return (
                    <div key={participant.id} className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
                      isActive 
                        ? `border-${borderColor}/60 bg-${participant.color}-500/10 scale-105 shadow-lg` 
                        : 'border-slate-600/40 bg-slate-800/30 hover:bg-slate-800/50'
                    }`}>
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-2xl">{participant.emoji}</div>
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-sm font-serif">{participant.name}</h4>
                            <div className="flex items-center gap-2 mb-1">
                              {participant.type === 'moderator' && (
                                <Badge className="text-xs px-1.5 py-0 bg-amber-600/20 text-amber-400">MOD</Badge>
                              )}
                              <Badge className="text-xs px-1.5 py-0 bg-slate-600/30 text-slate-300">
                                {participant.subtitle}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        {isActive ? (
                          <Badge className="bg-green-500/20 text-green-400 text-xs animate-pulse">SPEAKING</Badge>
                        ) : (
                          <p className="text-slate-400 text-xs italic">
                            {philosopherExpressions[participant.name] || "listening attentively"}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Desktop Speech Area */}
            <div className="flex-1 p-6 flex flex-col">
              <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 flex flex-col justify-center">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="text-4xl">{activeParticipant?.emoji || '⚖️'}</div>
                    <h2 className="text-2xl font-bold text-white font-serif">
                      {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
                    </h2>
                  </div>
                  <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                    {activeParticipant?.subtitle || 'The Great Questioner'}
                  </Badge>
                </div>
                
                <div className="flex-1 flex items-center justify-center mb-6">
                  <div className="text-center max-w-2xl">
                    <p className="text-slate-200 text-lg leading-relaxed italic mb-4">
                      "{currentStatement}"
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-400">Speaking...</span>
                    </div>
                  </div>
                </div>

                {/* Desktop Voice Control */}
                <div className="text-center">
                  <Button 
                    onClick={handleMuteToggle} 
                    size="lg" 
                    disabled={!isConnected}
                    className={`font-bold px-8 py-4 rounded-xl transition-all duration-200 hover:scale-105 ${
                      isUserMuted 
                        ? 'bg-gradient-to-r from-red-600/20 to-orange-500/20 hover:from-red-600/30 hover:to-orange-500/30 border border-red-500/30 text-red-300' 
                        : 'bg-gradient-to-r from-green-600/20 to-emerald-500/20 hover:from-green-600/30 hover:to-emerald-500/30 border border-green-500/30 text-green-300'
                    } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUserMuted ? (
                      <>
                        <MicOff className="h-5 w-5 mr-2" />
                        UNMUTE TO SPEAK
                      </>
                    ) : (
                      <>
                        <Mic className="h-5 w-5 mr-2 animate-pulse" />
                        YOU'RE LIVE
                      </>
                    )}
                  </Button>
                  <p className="text-slate-400 text-sm mt-2">
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
            </div>

            {/* Desktop Quick Challenges & Transcript */}
            <div className="p-6 pt-0 space-y-4">
              {/* Desktop Quick Challenges */}
              <div className="bg-slate-800/20 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">💭 Quick Challenges</h3>
                  <div className="flex gap-1">
                    <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400">
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-7 w-7 p-0 text-slate-400">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickChallenge(suggestion)}
                      disabled={!isConnected}
                      className={`p-2 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white text-sm transition-all duration-200 hover:scale-105 border border-slate-600/20 ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop Transcript */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30 max-h-60">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white tracking-wider">LIVE TRANSCRIPT</h3>
                  <span className="text-xs text-slate-400">{getCurrentSpeakerName()}</span>
                </div>
                
                <ScrollArea className="h-48">
                  <div className="space-y-2 pr-2">
                    {transcript.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                        Waiting for conversation to begin...
                      </div>
                    ) : (
                      transcript.map((message, index) => (
                        <div key={index} className="border-l-2 border-slate-600/30 pl-3">
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
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden flex-1 flex flex-col">
          {/* Mobile Participant Avatar Strip */}
          <div className="px-4 py-3 border-b border-slate-700/30">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {allParticipants.map((participant) => {
                const isActive = (currentSpeaker === participant.id);
                const colorMap = {
                  emerald: 'emerald-400',
                  red: 'red-400', 
                  blue: 'blue-400',
                  purple: 'purple-400',
                  amber: 'amber-400'
                };
                
                return (
                  <div key={participant.id} className={`flex-shrink-0 flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? `bg-${participant.color}-500/20 border border-${participant.color}-400/40 scale-110` 
                      : 'bg-slate-800/30 border border-slate-600/30'
                  }`}>
                    <div className={`text-2xl mb-1 ${isActive ? 'animate-bounce' : ''}`}>
                      {participant.emoji}
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-semibold text-white truncate max-w-16">
                        {participant.name}
                      </div>
                      {participant.type === 'moderator' && (
                        <Badge className="text-[10px] px-1 py-0 bg-amber-600/30 text-amber-300 mt-1">MOD</Badge>
                      )}
                      {isActive && (
                        <Badge className="bg-green-500/30 text-green-300 text-[10px] px-1 py-0 mt-1 animate-pulse">LIVE</Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Current Speaker Spotlight */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1 bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-center min-h-0">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{activeParticipant?.emoji || '⚖️'}</div>
                <h2 className="text-xl font-bold text-white font-serif mb-1">
                  {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
                </h2>
                <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                  {activeParticipant?.subtitle || 'The Great Questioner'}
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center mb-4 min-h-0">
                <div className="text-center">
                  <p className="text-slate-200 text-sm leading-relaxed italic mb-3">
                    "{currentStatement}"
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-slate-400 text-sm">Speaking...</span>
                  </div>
                </div>
              </div>

              {/* Mobile Voice Control */}
              <div className="text-center">
                <Button 
                  onClick={handleMuteToggle} 
                  size="lg" 
                  disabled={!isConnected}
                  className={`font-bold px-6 py-4 rounded-2xl transition-all duration-200 hover:scale-105 w-full max-w-xs mx-auto ${
                    isUserMuted 
                      ? 'bg-gradient-to-r from-red-600/20 to-orange-500/20 hover:from-red-600/30 hover:to-orange-500/30 border border-red-500/30 text-red-300' 
                      : 'bg-gradient-to-r from-green-600/20 to-emerald-500/20 hover:from-green-600/30 hover:to-emerald-500/30 border border-green-500/30 text-green-300'
                  } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUserMuted ? (
                    <>
                      <MicOff className="h-5 w-5 mr-2" />
                      UNMUTE TO SPEAK
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5 mr-2 animate-pulse" />
                      YOU'RE LIVE
                    </>
                  )}
                </Button>
                <p className="text-slate-400 text-xs mt-2">
                  {error 
                    ? 'Setup required: Configure your Vapi keys' 
                    : !isConnected 
                      ? 'Connecting...' 
                      : isUserMuted 
                        ? 'Tap to join the debate' 
                        : 'You can now speak to the philosophers'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Collapsible Quick Challenges */}
          <div className="px-4 pb-2">
            <button
              onClick={() => setChallengesExpanded(!challengesExpanded)}
              className="w-full bg-slate-800/20 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 flex items-center justify-between"
            >
              <span className="text-sm font-bold text-white">💭 Quick Challenges</span>
              {challengesExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>
            
            {challengesExpanded && (
              <div className="mt-2 bg-slate-800/20 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400">Choose a challenge:</span>
                  <div className="flex gap-1">
                    <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickChallenge(suggestion)}
                      disabled={!isConnected}
                      className={`w-full p-3 rounded-lg bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white text-sm transition-all duration-200 border border-slate-600/20 text-left ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Expandable Transcript */}
          <div className="px-4 pb-4">
            <button
              onClick={() => setTranscriptExpanded(!transcriptExpanded)}
              className="w-full bg-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Live Transcript</span>
                <Badge className="bg-green-500/20 text-green-400 text-xs">
                  {getCurrentSpeakerName()}
                </Badge>
              </div>
              {transcriptExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>
            
            {transcriptExpanded && (
              <div className="mt-2 bg-slate-800/30 backdrop-blur-sm rounded-xl p-3 border border-slate-700/30 max-h-60">
                <ScrollArea className="h-52">
                  <div className="space-y-2 pr-2">
                    {transcript.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                        Waiting for conversation to begin...
                      </div>
                    ) : (
                      transcript.map((message, index) => (
                        <div key={index} className="border-l-2 border-slate-600/30 pl-2">
                          <p className="text-slate-200 text-xs leading-relaxed break-words">
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
    </div>
  );
};
