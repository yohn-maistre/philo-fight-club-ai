
import { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, Users, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CircularParticipants } from "@/components/CircularParticipants";

interface SpeakingPlatformProps {
  currentSpeaker: 'philosopher1' | 'philosopher2' | 'moderator' | 'user';
  onToggleMute: () => void;
  isMuted: boolean;
  onToggleVolume: () => void;
  volumeOn: boolean;
  debateConfig: any;
  philosopherExpressions: {[key: string]: string};
  isConnected: boolean;
  streamingMessage?: string;
  challengeCount: number;
}

export const SpeakingPlatform = ({
  currentSpeaker,
  onToggleMute,
  isMuted,
  onToggleVolume,
  volumeOn,
  debateConfig,
  philosopherExpressions,
  isConnected,
  streamingMessage,
  challengeCount
}: SpeakingPlatformProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border-t border-slate-700 px-4 py-6">
      {/* Top Status Bar - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center justify-center sm:justify-start gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300 font-mono">{formatTime(currentTime)}</span>
          </div>
          <div className="w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-300">{challengeCount} challenges</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center sm:justify-end gap-3">
          <Badge 
            variant={isConnected ? "default" : "destructive"}
            className={`${isConnected ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white border-0`}
          >
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-300' : 'bg-red-300'} mr-2`} />
            {isConnected ? 'LIVE' : 'OFFLINE'}
          </Badge>
          <div className="flex items-center gap-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">4 active</span>
          </div>
        </div>
      </div>

      {/* Participants Circle */}
      <div className="mb-8">
        <CircularParticipants 
          currentSpeaker={currentSpeaker}
          debateConfig={debateConfig}
          philosopherExpressions={philosopherExpressions}
        />
      </div>

      {/* Live Streaming Message */}
      {streamingMessage && (
        <div className="mb-6 px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-400 uppercase tracking-wide font-semibold">Live Stream</span>
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            "{streamingMessage}"
          </p>
        </div>
      )}

      {/* Voice Controls */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={onToggleMute}
          size="lg"
          variant={isMuted ? "destructive" : "default"}
          className={`${
            isMuted 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          } px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200`}
        >
          {isMuted ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
          {isMuted ? "UNMUTE" : "MUTE"}
        </Button>

        <Button
          onClick={onToggleVolume}
          size="lg"
          variant="outline"
          className="border-slate-600 bg-slate-800/50 hover:bg-slate-700 text-slate-200 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200"
        >
          {volumeOn ? <Volume2 className="w-5 h-5 mr-2" /> : <VolumeX className="w-5 h-5 mr-2" />}
          {volumeOn ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
};
