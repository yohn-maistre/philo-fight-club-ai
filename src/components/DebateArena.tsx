
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mic, MicOff, Clock, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { useVapi } from "@/hooks/useVapi";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface DebateArenaProps {
  debateId: string;
  onBack: () => void;
}

// Animation variants
const speakerVariants = {
  initial: { y: 30, opacity: 0, scale: 0.8 },
  animate: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    }
  },
  exit: { 
    y: -30, 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3 }
  }
};

const participantVariants = {
  container: {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    initial: { y: 20, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  },
};

const transcriptVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

export const DebateArena = ({ debateId, onBack }: DebateArenaProps) => {
  const [currentSpeaker, setCurrentSpeaker] = useState<'philosopher1' | 'philosopher2' | 'moderator' | 'user'>('moderator');
  const [challengeCount, setChallengeCount] = useState(0);
  const [debateTime, setDebateTime] = useState(0);
  const [currentStatement, setCurrentStatement] = useState("");
  const [currentChallengeSet, setCurrentChallengeSet] = useState(0);
  const [isUserMuted, setIsUserMuted] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [rotationCount, setRotationCount] = useState(0);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
        
        if (message.transcript.speaker !== 'user') {
          const speakers: ('moderator' | 'philosopher1' | 'philosopher2')[] = ['moderator', 'philosopher1', 'philosopher2'];
          const currentIndex = speakers.indexOf(currentSpeaker as any);
          const nextSpeaker = speakers[(currentIndex + 1) % speakers.length];
          setCurrentSpeaker(nextSpeaker);
          setRotationCount(prev => prev + 360);
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
        philosophers: [{
          name: "Socrates",
          color: "emerald",
          subtitle: "The Questioner",
          emoji: "🤔",
          gradient: "from-emerald-500 to-teal-600"
        }, {
          name: "Nietzsche",
          color: "red",
          subtitle: "The Hammer",
          emoji: "🔥",
          gradient: "from-red-500 to-orange-600"
        }],
        moderator: {
          name: "Moderator",
          color: "amber",
          subtitle: "The Guide",
          emoji: "⚖️",
          gradient: "from-amber-500 to-yellow-600"
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

  // Get current speaker name
  const getCurrentSpeakerName = () => {
    if (currentSpeaker === 'philosopher1') return debateConfig.philosophers[0].name;
    if (currentSpeaker === 'philosopher2') return debateConfig.philosophers[1].name;
    if (currentSpeaker === 'moderator') return debateConfig.moderator.name;
    return 'Unknown';
  };

  // Get active participant
  const getActiveParticipant = () => {
    if (currentSpeaker === 'philosopher1') return debateConfig.philosophers[0];
    if (currentSpeaker === 'philosopher2') return debateConfig.philosophers[1];
    if (currentSpeaker === 'moderator') return debateConfig.moderator;
    return null;
  };

  const activeParticipant = getActiveParticipant();

  // All participants for selection
  const allParticipants = [
    { ...debateConfig.moderator, id: 'moderator' },
    { ...debateConfig.philosophers[0], id: 'philosopher1' },
    { ...debateConfig.philosophers[1], id: 'philosopher2' }
  ];

  // Challenge suggestions
  const socraticChallenges = [
    ["But what do you mean by that?", "Can you give a concrete example?", "What if someone disagreed?", "How do you know that's true?"],
    ["What assumptions are you making?", "Could there be another explanation?", "What evidence supports this?", "How would you respond to critics?"],
    ["What are the implications of that?", "Is this always the case?", "What would happen if everyone believed this?", "How do you define that term?"],
    ["What's the strongest argument against your view?", "Where does this logic lead us?", "Can you think of any exceptions?", "Why should we accept this premise?"],
    ["What would your opponents say?", "How did you reach that conclusion?", "What if the opposite were true?", "What's your best evidence for this?"]
  ];

  // Effects
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

  // Handlers
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

  const handleParticipantSelect = (participantId: string) => {
    setCurrentSpeaker(participantId as any);
    setRotationCount(prev => prev + 720);
  };

  const nextChallengeSet = () => {
    setCurrentChallengeSet(prev => (prev + 1) % socraticChallenges.length);
  };

  const prevChallengeSet = () => {
    setCurrentChallengeSet(prev => (prev - 1 + socraticChallenges.length) % socraticChallenges.length);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Floating Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-slate-700/30"
      >
        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center flex-1 px-4">
            <h1 className="text-lg font-bold text-white font-serif">{debateConfig.title}</h1>
            <p className="text-slate-400 text-sm hidden sm:block">"{debateConfig.topic}"</p>
          </div>
          
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(debateTime)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              <span>{challengeCount}</span>
            </div>
            <Badge className={`${isConnected ? 'bg-green-500' : isLoading ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
              {isConnected ? '🟢' : isLoading ? '🟡' : '🔴'}
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
          
          {/* Left Panel - Participants */}
          <motion.div 
            className="lg:col-span-1 space-y-6"
            initial="initial"
            animate="animate"
            variants={participantVariants.container}
          >
            <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/30 overflow-hidden">
              <CardContent className="p-0">
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{
                    opacity: 1,
                    height: "6rem",
                    transition: {
                      height: {
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                      },
                    },
                  }}
                  className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 w-full"
                />
                
                <div className="px-6 pb-6 -mt-12">
                  <motion.h3 
                    className="text-center text-white font-bold text-lg mb-4"
                    variants={participantVariants.item}
                  >
                    PARTICIPANTS
                  </motion.h3>
                  
                  <motion.div 
                    className="space-y-3"
                    variants={participantVariants.container}
                  >
                    {allParticipants.map((participant) => {
                      const isActive = (currentSpeaker === participant.id);
                      return (
                        <motion.button
                          key={participant.id}
                          onClick={() => handleParticipantSelect(participant.id)}
                          className={cn(
                            "w-full p-4 rounded-xl transition-all duration-300 text-left",
                            "hover:scale-105 hover:shadow-lg",
                            isActive 
                              ? `bg-gradient-to-r ${participant.gradient} text-white shadow-lg scale-105`
                              : 'bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white'
                          )}
                          variants={participantVariants.item}
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{participant.emoji}</div>
                            <div className="flex-1">
                              <h4 className="font-bold font-serif">{participant.name}</h4>
                              <p className="text-sm opacity-90">{participant.subtitle}</p>
                            </div>
                            {isActive && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-3 h-3 bg-white rounded-full animate-pulse"
                              />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/30 flex-1">
              <CardContent className="p-6 h-full flex flex-col">
                <h3 className="text-white font-bold text-sm tracking-wider mb-4">LIVE TRANSCRIPT</h3>
                <ScrollArea className="flex-1">
                  <div className="space-y-3 pr-2">
                    <AnimatePresence>
                      {transcript.length === 0 ? (
                        <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
                          Waiting for conversation to begin...
                        </div>
                      ) : (
                        transcript.map((message, index) => (
                          <motion.div
                            key={index}
                            variants={transcriptVariants}
                            initial="initial"
                            animate="animate"
                            className="p-3 rounded-lg bg-slate-700/20 border-l-2 border-slate-500/30"
                          >
                            <p className="text-slate-200 text-sm leading-relaxed break-words">
                              {message}
                            </p>
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                    <div ref={transcriptEndRef} />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          {/* Center Panel - Main Speaker */}
          <motion.div 
            className="lg:col-span-2 flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="flex-1 bg-gradient-to-b from-slate-800/40 to-slate-900/40 backdrop-blur-sm border-slate-700/30 overflow-hidden">
              <CardContent className="p-0 h-full flex flex-col">
                
                {/* Speaker Spotlight */}
                <div className="flex-1 flex flex-col justify-center p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSpeaker}
                      variants={speakerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="text-center"
                    >
                      {/* Large Avatar Display */}
                      <motion.div
                        className={cn(
                          "relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-6",
                          "bg-gradient-to-br shadow-2xl",
                          activeParticipant?.gradient || "from-slate-600 to-slate-700"
                        )}
                        animate={{
                          rotate: rotationCount,
                        }}
                        transition={{
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-8xl">
                            {activeParticipant?.emoji || '⚖️'}
                          </div>
                        </div>
                      </motion.div>

                      {/* Speaker Info */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <h2 className="text-4xl font-bold text-white font-serif mb-2">
                          {activeParticipant?.name.toUpperCase() || 'MODERATOR'}
                        </h2>
                        <Badge 
                          variant="secondary" 
                          className="bg-slate-700/50 text-slate-300 text-lg px-4 py-1"
                        >
                          {activeParticipant?.subtitle || 'The Great Questioner'}
                        </Badge>
                      </motion.div>

                      {/* Current Statement */}
                      <motion.div
                        className="mt-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="bg-slate-700/20 backdrop-blur-sm rounded-2xl p-6 border border-slate-600/30">
                          <p className="text-slate-200 text-xl leading-relaxed italic">
                            "{currentStatement}"
                          </p>
                          <div className="flex items-center justify-center gap-2 mt-4">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-slate-400 text-sm">Speaking...</span>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Voice Control */}
                <motion.div 
                  className="p-8 border-t border-slate-700/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="text-center">
                    <Button 
                      onClick={handleMuteToggle} 
                      size="lg" 
                      disabled={!isConnected}
                      className={cn(
                        "font-bold px-8 py-6 rounded-2xl transition-all duration-300 hover:scale-105 text-lg",
                        isUserMuted 
                          ? 'bg-gradient-to-r from-red-600/30 to-orange-500/30 hover:from-red-600/40 hover:to-orange-500/40 border border-red-500/40 text-red-200' 
                          : 'bg-gradient-to-r from-green-600/30 to-emerald-500/30 hover:from-green-600/40 hover:to-emerald-500/40 border border-green-500/40 text-green-200',
                        !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                      )}
                    >
                      {isUserMuted ? (
                        <>
                          <MicOff className="h-5 w-5 mr-3" />
                          UNMUTE TO SPEAK
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5 mr-3 animate-pulse" />
                          YOU'RE LIVE
                        </>
                      )}
                    </Button>
                    <p className="text-slate-400 text-sm mt-3">
                      {error 
                        ? 'Setup required: Configure your Vapi keys' 
                        : !isConnected 
                          ? 'Connecting...' 
                          : isUserMuted 
                            ? 'Click to join the philosophical debate' 
                            : 'You can now speak to the philosophers'
                      }
                    </p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>

            {/* Quick Challenges */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-slate-800/30 backdrop-blur-sm border-slate-700/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-sm">💭 SOCRATIC CHALLENGES</h3>
                    <div className="flex gap-2">
                      <Button onClick={prevChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button onClick={nextChallengeSet} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {socraticChallenges[currentChallengeSet].map((suggestion, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuickChallenge(suggestion)}
                        disabled={!isConnected}
                        className={cn(
                          "p-4 rounded-xl bg-slate-700/30 hover:bg-slate-600/40 text-slate-300 hover:text-white text-sm transition-all duration-200 hover:scale-105 border border-slate-600/20 text-left",
                          !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                        )}
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        "{suggestion}"
                      </motion.button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
