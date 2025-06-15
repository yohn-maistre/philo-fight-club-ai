
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Clock, TrendingUp, Sparkles } from "lucide-react";
import { useState } from "react";

interface Philosopher {
  name: string;
  subtitle: string;
  quote: string;
  color: string;
}

interface BattleCardProps {
  id: string;
  title: string;
  topic: string;
  description: string;
  philosophers: Philosopher[];
  duration: string;
  onJoinBattle: (battleId: string) => void;
  isNew?: boolean;
  isTrending?: boolean;
  animationDelay?: number;
}

export const BattleCard = ({ 
  id, 
  title, 
  topic, 
  description, 
  philosophers, 
  duration, 
  onJoinBattle,
  isNew = false,
  isTrending = false,
  animationDelay = 0
}: BattleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses = {
    emerald: "border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-400/60 hover:bg-emerald-500/20",
    red: "border-red-500/30 bg-red-500/10 hover:border-red-400/60 hover:bg-red-500/20", 
    blue: "border-blue-500/30 bg-blue-500/10 hover:border-blue-400/60 hover:bg-blue-500/20",
    purple: "border-purple-500/30 bg-purple-500/10 hover:border-purple-400/60 hover:bg-purple-500/20"
  };

  return (
    <Card 
      className="bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-500 group backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 animate-fade-in-up cursor-pointer relative overflow-hidden"
      style={{ animationDelay: `${animationDelay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badges */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        {isNew && (
          <Badge className="bg-green-500 text-white text-xs animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            NEW
          </Badge>
        )}
        {isTrending && (
          <Badge className="bg-orange-500 text-white text-xs animate-bounce">
            <TrendingUp className="h-3 w-3 mr-1" />
            TRENDING
          </Badge>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      <CardContent className="p-6 relative z-10">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white font-serif mb-2 group-hover:text-yellow-300 transition-colors duration-300">
            {title}
          </h3>
          <Badge variant="secondary" className="bg-slate-700 text-slate-300 mb-3 group-hover:bg-yellow-600 group-hover:text-white transition-all duration-300">
            {topic}
          </Badge>
          <p className="text-slate-300 text-sm italic mb-4 group-hover:text-slate-200 transition-colors duration-300">
            "{description}"
          </p>
        </div>
        
        <div className="space-y-3 mb-6">
          {philosophers.map((philosopher, index) => (
            <div key={philosopher.name} className="relative">
              <div className={`p-3 rounded-lg border transition-all duration-500 ${colorClasses[philosopher.color as keyof typeof colorClasses]} ${isHovered ? 'transform translate-x-2' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm font-serif">{philosopher.name}</h4>
                    <p className="text-xs text-slate-400">{philosopher.subtitle}</p>
                  </div>
                  <div className={`text-lg transition-transform duration-300 ${isHovered ? 'animate-bounce' : 'opacity-60'}`}>
                    {philosopher.color === 'emerald' && '💭'}
                    {philosopher.color === 'red' && '🔥'}
                    {philosopher.color === 'blue' && '🧠'}
                    {philosopher.color === 'purple' && '⚡'}
                  </div>
                </div>
                <p className="text-slate-300 text-xs italic mt-2">"{philosopher.quote}"</p>
              </div>
              
              {index === 0 && philosophers.length > 1 && (
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className={`bg-slate-600 text-white px-2 py-1 rounded text-xs font-bold transition-all duration-300 ${isHovered ? 'animate-pulse bg-yellow-600' : ''}`}>
                    ⚔️ VS
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm group-hover:text-slate-300 transition-colors duration-300">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          
          <Button 
            onClick={() => onJoinBattle(id)}
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50 animate-pulse-gentle"
          >
            <Mic className="h-4 w-4 mr-2" />
            Join Battle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
