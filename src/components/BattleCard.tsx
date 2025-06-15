
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Clock, User } from "lucide-react";

interface Philosopher {
  name: string;
  subtitle: string;
  quote: string;
  color: string;
  emoji: string;
}

interface Moderator {
  name: string;
  subtitle: string;
  intro: string;
}

interface BattleCardProps {
  id: string;
  title: string;
  topic: string;
  description: string;
  category: string;
  philosophers: Philosopher[];
  moderator: Moderator;
  duration: string;
  onJoinBattle: (battleId: string) => void;
}

export const BattleCard = ({ 
  id, 
  title, 
  topic, 
  description, 
  philosophers, 
  moderator,
  duration, 
  onJoinBattle 
}: BattleCardProps) => {
  const colorClasses = {
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    red: "border-red-500/20 bg-red-500/5", 
    blue: "border-blue-500/20 bg-blue-500/5",
    purple: "border-purple-500/20 bg-purple-500/5"
  };

  return (
    <Card className="bg-slate-800/30 border-slate-700/40 hover:bg-slate-800/50 transition-all duration-300 group backdrop-blur-sm hover:scale-105 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white font-serif mb-2">{title}</h3>
          <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 mb-3 text-xs">
            {topic}
          </Badge>
          <p className="text-slate-300 text-sm italic mb-4">"{description}"</p>
        </div>
        
        {/* Moderator Section */}
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-amber-400" />
            <span className="text-amber-400 text-xs font-semibold">MODERATOR</span>
          </div>
          <h4 className="font-semibold text-white text-sm font-serif">{moderator.name}</h4>
          <p className="text-xs text-slate-400 mb-2">{moderator.subtitle}</p>
          <p className="text-slate-300 text-xs italic leading-relaxed">"{moderator.intro.slice(0, 120)}..."</p>
        </div>
        
        {/* Philosophers Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-semibold text-slate-400 tracking-wider">DEBATERS</div>
            <div className="flex-1 h-px bg-slate-700"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {philosophers.map((philosopher, index) => (
              <div key={philosopher.name} className={`p-3 rounded-lg border ${colorClasses[philosopher.color as keyof typeof colorClasses]} transition-all duration-300`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{philosopher.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm font-serif truncate">{philosopher.name}</h4>
                    <p className="text-xs text-slate-400 truncate">{philosopher.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-xs italic mt-2 leading-relaxed">"{philosopher.quote}"</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          
          <Button 
            onClick={() => onJoinBattle(id)}
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-semibold group-hover:scale-105 transition-transform"
          >
            <Mic className="h-4 w-4 mr-2" />
            Join Debate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
