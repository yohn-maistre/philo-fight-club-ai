import { useState, useEffect, useRef, useCallback } from "react";
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
import { getSquadConfig, SquadAssistantConfig } from "@/config/squadConfigs";

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
  const [currentSpeakerName, setCurrentSpeakerName] = useState<string>('Moderator');
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [currentAssistantIndex, setCurrentAssistantIndex] = useState(0);

  // Get squad configuration
  const squadConfig = getSquadConfig(debateId);

<<<<<<< HEAD
  // Helper to get assistant index by name
  const getAssistantIndexByName = (name: string) => {
    if (!squadConfig) return -1;
    return squadConfig.members.findIndex(m => m.assistant.name.toLowerCase() === name.toLowerCase());
  };

  // Vapi integration with improved message handling
  const {
    isConnected,
    isLoading: vapiLoading,
    error,
    hasTriedConnection,
    connect,
    disconnect,
    sendMessage,
    mute,
    unmute,
    isMuted,
    switchAssistant
=======
  // Vapi integration with improved error handling
  const { 
    isConnected, 
    isLoading: vapiLoading, 
    error, 
    hasTriedConnection,
    currentSpeaker: vapiCurrentSpeaker,
    connect, 
    disconnect, 
    sendMessage, 
    sendBackgroundMessage,
    mute, 
    unmute, 
    isMuted 
>>>>>>> 3843b9424daafef099c4019fb4f6cdb87b35ae4a
  } = useVapi({
    onConnect: () => {
      console.log('Successfully connected to Vapi debate system');
      setTranscript(prev => [...prev, 'System: 🎭 Connected to philosophical debate arena']);
      toast({
        title: "Arena Connected",
        description: "The philosophical debate is now live",
      });
    },
    onDisconnect: () => {
      console.log('Disconnected from Vapi debate system');
      setTranscript(prev => [...prev, 'System: 📞 Debate session ended']);
    },
    onMessage: (message) => {
      console.log('Debate message received:', message);
      if (message.transcript) {
        const speaker = message.transcript.speaker === 'user' ? 'You' : message.transcript.speaker || 'AI';
<<<<<<< HEAD
        setTranscript(prev => [...prev, `${speaker}: ${message.transcript!.transcript}`]);
        // Update current speaker based on transcript
=======
        const transcriptText = message.transcript.transcript;
        
        setTranscript(prev => [...prev, `${speaker}: ${transcriptText}`]);
        
        // Update current speaker and statement for non-user messages
>>>>>>> 3843b9424daafef099c4019fb4f6cdb87b35ae4a
        if (message.transcript.speaker !== 'user') {
          setCurrentSpeakerName(message.transcript.speaker || 'AI');
          setCurrentStatement(transcriptText);
        }
      }
    },
    onSpeechStart: () => {
      console.log('Speech detected in debate arena');
    },
    onSpeechEnd: () => {
      console.log('Speech ended in debate arena');
    },
    onSpeakerChange: (speaker) => {
      console.log('Speaker changed to:', speaker);
      setCurrentSpeakerName(speaker);
      
      // Send background message about other participants' expressions
      const otherPhilosophers = Object.keys(philosopherExpressions).filter(name => 
        name.toLowerCase() !== speaker.toLowerCase()
      );
      
      if (otherPhilosophers.length > 0) {
        const randomPhilosopher = otherPhilosophers[Math.floor(Math.random() * otherPhilosophers.length)];
        const randomExpression = absurdExpressions[Math.floor(Math.random() * absurdExpressions.length)];
        sendBackgroundMessage(`While ${speaker} speaks, ${randomPhilosopher} is ${randomExpression} in the background.`);
      }
    },
    onError: (error) => {
<<<<<<< HEAD
      console.error('Vapi error:', error);
      if (!transcript.some(msg => msg.includes('Error -'))) {
        setTranscript(prev => [...prev, `System: Error - ${error.message || 'Connection failed'}`]);
=======
      console.error('Vapi debate error:', error);
      const errorMsg = `Debate Error: ${error?.message || 'Connection failed'}`;
      
      // Prevent duplicate error messages
      if (!transcript.some(msg => msg.includes(errorMsg))) {
        setTranscript(prev => [...prev, `System: ⚠️ ${errorMsg}`]);
>>>>>>> 3843b9424daafef099c4019fb4f6cdb87b35ae4a
      }
      
      toast({
        title: "Debate Connection Error",
        description: error?.message || "Failed to connect to philosophical arena",
        variant: "destructive",
      });
    },
    onTransfer: (assistantName: string) => {
      if (!squadConfig) return;
      const nextIndex = getAssistantIndexByName(assistantName);
      if (nextIndex !== -1 && nextIndex !== currentAssistantIndex) {
        setCurrentAssistantIndex(nextIndex);
        switchAssistant(squadConfig.members[nextIndex].assistant);
        setTranscript(prev => [...prev, `System: Transferring to ${assistantName}...`]);
      }
    }
  });

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
        moderator: {
          name: "Aristotle",
          color: "blue",
          subtitle: "The Moderator"
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
        moderator: {
          name: "Kant",
          color: "amber",
          subtitle: "The Synthesizer"
        }
      },
      "knowledge-debate": {
        title: "The Truth Battle",
        topic: "Does knowledge come from reason or experience?",
        philosophers: [{
          name: "Kant",
          color: "blue",
          subtitle: "The Synthesizer"
        }, {
          name: "Hume",
          color: "purple",
          subtitle: "The Skeptic"
        }],
        moderator: {
          name: "Aristotle",
          color: "amber",
          subtitle: "The Logician"
        }
      }
    };
    return configs[id as keyof typeof configs] || configs["morality-debate"];
  };

  const debateConfig = getDebateConfig(debateId);

  // Update expressions every 3-5 seconds and send background messages
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
  }, [debateConfig, sendBackgroundMessage]);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setDebateTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

<<<<<<< HEAD
  // On mount, start with the first assistant (moderator)
  useEffect(() => {
    if (squadConfig && !hasTriedConnection) {
      console.log('Connecting to Vapi with first assistant:', squadConfig.members[0].assistant);
      connect(squadConfig.members[0].assistant);
=======
  // Initialize Vapi connection with squad config - only once with better error handling
  useEffect(() => {
    if (squadConfig && !hasTriedConnection && !isConnected && !vapiLoading) {
      console.log('Connecting to Vapi with squad config:', squadConfig);
      connect({ squadConfig });
>>>>>>> 3843b9424daafef099c4019fb4f6cdb87b35ae4a
    }
  }, [squadConfig, hasTriedConnection, isConnected, vapiLoading, connect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  // Auto-scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Retry connection function
  const retryConnection = useCallback(() => {
    if (squadConfig) {
      console.log('Retrying Vapi connection');
      connect({ squadConfig });
    }
  }, [squadConfig, connect]);

  // Show loading screen with better error handling
  if (!hasTriedConnection || (vapiLoading && !isConnected && !error)) {
    return <LoadingScreen 
      message={error ? error : "Connecting to the philosophical arena..."} 
      isError={!!error}
      onRetry={error ? retryConnection : undefined}
    />;
  }

  // Show error screen if connection failed and not loading
  if (error && !vapiLoading && !isConnected) {
    return <LoadingScreen 
      message={error} 
      isError={true}
      onRetry={retryConnection}
    />;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMuteToggle = () => {
    if (isMuted) {
      unmute();
      setChallengeCount(prev => prev + 1);
    } else {
      mute();
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

  // Get active participant info based on current speaker name
  const getActiveParticipant = () => {
    // Try to match current speaker name with philosophers or moderator
    const philosopher1 = debateConfig.philosophers.find(p => 
      p.name.toLowerCase() === currentSpeakerName.toLowerCase()
    );
    if (philosopher1) return philosopher1;
    
    if (debateConfig.moderator.name.toLowerCase() === currentSpeakerName.toLowerCase()) {
      return debateConfig.moderator;
    }
    
    // Default to moderator if no match
    return debateConfig.moderator;
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
      
      {/* Modernized Mobile-First Header */}
      <div className="relative z-10 px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={onBack} 
              className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all duration-200 self-start"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Arena
            </Button>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-slate-400 text-sm sm:text-base">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-slate-700/30">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-mono text-xs sm:text-sm">{formatTime(debateTime)}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-800/30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm border border-slate-700/30">
                <Target className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">{challengeCount} challenges</span>
              </div>
              <Badge className={`${isConnected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : error ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'} backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3 py-1`}>
                {isConnected ? '🟢 LIVE' : error ? '🔴 ERROR' : '🟡 CONNECTING'}
              </Badge>
            </div>
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

          {/* Circular Participants - More Mobile Friendly */}
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
              currentStatement={currentStatement || "Welcome to the philosophical arena..."}
            />
          </div>
            
          {/* Modern Voice Control */}
          <div className="text-center mb-12">
            <Button 
              onClick={handleMuteToggle} 
              size="lg" 
              disabled={!isConnected}
              className={`relative font-semibold text-lg px-10 py-5 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 shadow-2xl ${
                isMuted 
                  ? 'bg-gradient-to-r from-slate-700/50 via-slate-600/50 to-slate-700/50 hover:from-slate-600/60 hover:via-slate-500/60 hover:to-slate-600/60 border-2 border-slate-500/30 hover:border-slate-400/40 text-slate-200 hover:text-white' 
                  : 'bg-gradient-to-r from-emerald-600/40 via-emerald-500/40 to-green-500/40 hover:from-emerald-600/50 hover:via-emerald-500/50 hover:to-green-500/50 border-2 border-emerald-500/40 hover:border-emerald-400/50 text-emerald-100 hover:text-white shadow-emerald-500/25'
              } ${!isConnected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-3">
                {isMuted ? (
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
                ? `Voice Error: ${error}` 
                : !isConnected 
                  ? 'Establishing voice connection to debate arena...' 
                  : isMuted 
                    ? 'Click to join the philosophical debate with your voice' 
                    : 'You are now participating in the live debate'
              }
            </p>
          </div>

          {/* Sleeker Transcript Section */}
          {transcript.length > 0 && (
            <div className="mb-12">
              <div className="bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/20 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-green-400/30 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-xl font-semibold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                      Live Transcript
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTranscriptExpanded(!isTranscriptExpanded)}
                    className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl backdrop-blur-sm border border-slate-600/20"
                  >
                    {isTranscriptExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
                
                <ScrollArea className={`${isTranscriptExpanded ? 'h-80' : 'h-48'} transition-all duration-300`}>
                  <div className="space-y-4 pr-4">
                    {transcript.map((message, index) => (
                      <div key={index} className="group relative">
                        <div className="absolute left-0 top-2 w-0.5 h-6 bg-gradient-to-b from-emerald-400/50 to-transparent rounded-full"></div>
                        <div className="pl-6 py-2 bg-slate-800/20 backdrop-blur-sm rounded-xl border-l-2 border-emerald-400/20 hover:border-emerald-400/40 transition-all duration-200">
                          <p className="text-slate-200 leading-relaxed text-sm group-hover:text-white transition-colors">
                            {message}
                          </p>
                        </div>
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
