
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Mic, MicOff, Clock, Target } from "lucide-react";
import { motion } from "framer-motion";
import { useVapi } from "@/hooks/useVapi";
import { useToast } from "@/hooks/use-toast";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

// Animation states for each speaker type
const speakerStates = [
  {
    // Moderator
    bgColor: "#1e293b", // slate-800
    accentColor: "#f59e0b", // amber-500
    textColor: "#f8fafc", // slate-50
    emoji: "🎭",
    name: "MODERATOR",
    subtitle: "The Great Questioner"
  },
  {
    // Philosopher 1 (Socrates)
    bgColor: "#064e3b", // emerald-900
    accentColor: "#10b981", // emerald-500
    textColor: "#f0fdf4", // green-50
    emoji: "💭",
    name: "SOCRATES",
    subtitle: "The Questioner"
  },
  {
    // Philosopher 2 (Nietzsche)
    bgColor: "#7f1d1d", // red-900
    accentColor: "#ef4444", // red-500
    textColor: "#fef2f2", // red-50
    emoji: "🔥",
    name: "NIETZSCHE",
    subtitle: "The Hammer"
  }
];

const PhilosopherAvatar = ({ emoji, isActive }: { emoji: string; isActive: boolean }) => (
  <motion.div
    className="flex items-center justify-center text-6xl"
    animate={{
      scale: isActive ? 1.2 : 0.8,
      opacity: isActive ? 1 : 0.6,
    }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
    {emoji}
  </motion.div>
);

export const DebateArena = ({ debateId, onBack }: DebateArenaProps) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<'moderator' | 'philosopher1' | 'philosopher2'>('moderator');
  const [challengeCount, setChallengeCount] = useState(0);
  const [debateTime, setDebateTime] = useState(0);
  const [currentStatement, setCurrentStatement] = useState("");
  const [isUserMuted, setIsUserMuted] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Get current speaker index for animation state
  const getCurrentSpeakerIndex = () => {
    switch (currentSpeaker) {
      case 'moderator': return 0;
      case 'philosopher1': return 1;
      case 'philosopher2': return 2;
      default: return 0;
    }
  };

  const currentState = speakerStates[getCurrentSpeakerIndex()];
  const transition = { type: "spring", stiffness: 300, damping: 30 };

  // Vapi integration
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
        
        // Cycle through speakers
        if (message.transcript.speaker !== 'user') {
          const speakers: ('moderator' | 'philosopher1' | 'philosopher2')[] = ['moderator', 'philosopher1', 'philosopher2'];
          const currentIndex = speakers.indexOf(currentSpeaker);
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

  // Get debate config
  const getDebateConfig = (id: string) => {
    const configs = {
      "morality-debate": {
        title: "The Morality Clash",
        topic: "Is morality objective or subjective?",
        assistantId: "YOUR_MORALITY_ASSISTANT_ID",
        statements: {
          moderator: ["Welcome to today's philosophical debate on the nature of morality. Let us begin by establishing our fundamental positions...", "An interesting point has been raised. Let us explore this further before moving to our next consideration...", "I believe we should now turn our attention to the implications of what has been discussed..."],
          philosopher1: ["Before we can discuss whether morality is objective, shouldn't we first examine what we mean by 'morality' itself?", "You speak of strength and weakness, but I confess I do not understand these terms.", "Perhaps you are right, but I wonder... if there are no universal moral truths, then how can we say that creating one's own values is better?"],
          philosopher2: ["Your precious 'objective morality' is nothing but the bleating of weak souls who lack the courage to create their own values!", "What you call 'good' and 'evil' are merely human constructions, created by those too cowardly to embrace their own power!", "The masses cling to their moral absolutes because they fear the terrifying freedom of creating meaning for themselves!"]
        }
      }
    };
    return configs[id as keyof typeof configs] || configs["morality-debate"];
  };

  const debateConfig = getDebateConfig(debateId);

  const getCurrentSpeakerName = () => {
    if (currentSpeaker === 'philosopher1') return 'Socrates';
    if (currentSpeaker === 'philosopher2') return 'Nietzsche';
    return 'Moderator';
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setDebateTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update statement when speaker changes
  useEffect(() => {
    const statements = debateConfig.statements[currentSpeaker];
    if (statements) {
      setCurrentStatement(statements[Math.floor(Math.random() * statements.length)]);
    }
  }, [currentSpeaker, debateConfig]);

  // Initialize Vapi connection
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

  // Auto-scroll transcript
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
    
    // Cycle to next speaker after challenge
    const speakers: ('moderator' | 'philosopher1' | 'philosopher2')[] = ['moderator', 'philosopher1', 'philosopher2'];
    const currentIndex = speakers.indexOf(currentSpeaker);
    const nextSpeaker = speakers[(currentIndex + 1) % speakers.length];
    setCurrentSpeaker(nextSpeaker);
  };

  const quickChallenges = [
    "But what do you mean by that?",
    "Can you give a concrete example?", 
    "What if someone disagreed?",
    "How do you know that's true?"
  ];

  return (
    <motion.div
      className="min-h-screen flex flex-col overflow-hidden"
      animate={{ backgroundColor: currentState.bgColor }}
      transition={transition}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="text-white/80 hover:text-white p-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center flex-1 px-2">
            <motion.h1 
              className="text-lg font-bold font-serif"
              animate={{ color: currentState.textColor }}
              transition={transition}
            >
              The Morality Clash
            </motion.h1>
            <motion.p 
              className="text-sm opacity-80"
              animate={{ color: currentState.textColor }}
              transition={transition}
            >
              "Is morality objective or subjective?"
            </motion.p>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-white/80">
              <Clock className="h-3 w-3" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-1 text-white/80">
              <Target className="h-3 w-3" />
              <span>{challengeCount}</span>
            </div>
            <Badge className={`${isConnected ? 'bg-green-500/20 text-green-300' : isLoading ? 'bg-yellow-500/20 text-yellow-300' : 'bg-red-500/20 text-red-300'} text-xs`}>
              {isConnected ? '🟢' : isLoading ? '🟡' : '🔴'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {/* Current Speaker Display */}
          <motion.div
            className="text-center mb-8"
            animate={{ color: currentState.textColor }}
            transition={transition}
          >
            <motion.h2
              className="text-2xl font-bold mb-2 font-serif"
              animate={{ color: currentState.accentColor }}
              transition={transition}
            >
              {currentState.name}
            </motion.h2>
            <motion.p
              className="text-sm opacity-80 mb-6"
              animate={{ color: currentState.textColor }}
              transition={transition}
            >
              {currentState.subtitle}
            </motion.p>
          </motion.div>

          {/* Philosopher Avatars Row */}
          <div className="flex items-center justify-center gap-12 mb-8">
            {speakerStates.map((state, index) => (
              <div key={index} className="flex flex-col items-center">
                <PhilosopherAvatar 
                  emoji={state.emoji} 
                  isActive={getCurrentSpeakerIndex() === index} 
                />
                <motion.div
                  className="mt-2 text-xs font-medium text-center"
                  animate={{ 
                    color: getCurrentSpeakerIndex() === index ? currentState.accentColor : currentState.textColor,
                    opacity: getCurrentSpeakerIndex() === index ? 1 : 0.6 
                  }}
                  transition={transition}
                >
                  {state.name}
                </motion.div>
              </div>
            ))}
          </div>

          {/* Current Statement */}
          <motion.div
            className="text-center mb-8 p-6 rounded-xl border border-white/10 backdrop-blur-sm"
            animate={{ 
              backgroundColor: `${currentState.accentColor}15`,
              borderColor: `${currentState.accentColor}30`
            }}
            transition={transition}
          >
            <motion.p
              className="text-lg italic leading-relaxed"
              animate={{ color: currentState.textColor }}
              transition={transition}
            >
              "{currentStatement}"
            </motion.p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <motion.div 
                className="w-2 h-2 rounded-full animate-pulse"
                animate={{ backgroundColor: currentState.accentColor }}
                transition={transition}
              />
              <motion.span 
                className="text-sm"
                animate={{ color: currentState.textColor }}
                transition={transition}
              >
                Speaking...
              </motion.span>
            </div>
          </motion.div>

          {/* Voice Control */}
          <div className="text-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleMuteToggle} 
                size="lg" 
                disabled={!isConnected}
                className={`font-bold px-8 py-4 rounded-xl transition-all duration-200 ${
                  isUserMuted 
                    ? 'bg-white/10 hover:bg-white/20 border border-white/20 text-white' 
                    : 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300'
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
            </motion.div>
            <motion.p 
              className="text-sm mt-2 opacity-80"
              animate={{ color: currentState.textColor }}
              transition={transition}
            >
              {error 
                ? 'Setup required: Configure your Vapi keys' 
                : !isConnected 
                  ? 'Connecting...' 
                  : isUserMuted 
                    ? 'Click to join the debate' 
                    : 'You can now speak to the philosophers'
              }
            </motion.p>
          </div>

          {/* Quick Challenges */}
          <motion.div
            className="mb-6 p-4 rounded-xl border border-white/10 backdrop-blur-sm"
            animate={{ 
              backgroundColor: `${currentState.accentColor}10`,
              borderColor: `${currentState.accentColor}20`
            }}
            transition={transition}
          >
            <motion.h3 
              className="text-sm font-bold mb-3 text-center"
              animate={{ color: currentState.textColor }}
              transition={transition}
            >
              💭 Quick Challenges
            </motion.h3>
            <div className="grid grid-cols-2 gap-2">
              {quickChallenges.map((challenge, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleQuickChallenge(challenge)}
                  disabled={!isConnected}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm transition-all duration-200 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ color: currentState.textColor }}
                  transition={transition}
                >
                  "{challenge}"
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Live Transcript */}
          <motion.div
            className="p-4 rounded-xl border border-white/10 backdrop-blur-sm max-h-48"
            animate={{ 
              backgroundColor: `${currentState.accentColor}10`,
              borderColor: `${currentState.accentColor}20`
            }}
            transition={transition}
          >
            <div className="flex items-center justify-between mb-3">
              <motion.h3 
                className="text-sm font-bold"
                animate={{ color: currentState.textColor }}
                transition={transition}
              >
                LIVE TRANSCRIPT
              </motion.h3>
              <motion.span 
                className="text-xs"
                animate={{ color: currentState.accentColor }}
                transition={transition}
              >
                {getCurrentSpeakerName()}
              </motion.span>
            </div>
            
            <ScrollArea className="h-32">
              <div className="space-y-2 pr-2">
                {transcript.length === 0 ? (
                  <motion.div 
                    className="flex items-center justify-center h-24 text-sm opacity-60"
                    animate={{ color: currentState.textColor }}
                    transition={transition}
                  >
                    Waiting for conversation to begin...
                  </motion.div>
                ) : (
                  transcript.map((message, index) => (
                    <motion.div 
                      key={index} 
                      className="border-l-2 pl-3"
                      animate={{ borderColor: `${currentState.accentColor}30` }}
                      transition={transition}
                    >
                      <motion.p
                        className="text-sm leading-relaxed break-words"
                        animate={{ color: currentState.textColor }}
                        transition={transition}
                      >
                        {message}
                      </motion.p>
                    </motion.div>
                  ))
                )}
                <div ref={transcriptEndRef} />
              </div>
            </ScrollArea>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
