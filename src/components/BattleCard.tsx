
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Clock } from "lucide-react";

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
}

export const BattleCard = ({ 
  id, 
  title, 
  topic, 
  description, 
  philosophers, 
  duration, 
  onJoinBattle 
}: BattleCardProps) => {
  const colorClasses = {
    emerald: "border-emerald-500/30 bg-emerald-500/5",
    red: "border-red-500/30 bg-red-500/5", 
    blue: "border-blue-500/30 bg-blue-500/5",
    purple: "border-purple-500/30 bg-purple-500/5"
  };

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 transition-all duration-300 group backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white font-serif mb-2">{title}</h3>
          <Badge variant="secondary" className="bg-slate-700 text-slate-300 mb-3 hover:bg-slate-700">
            {topic}
          </Badge>
          <p className="text-slate-300 text-sm italic mb-4">"{description}"</p>
        </div>
        
        <div className="space-y-3 mb-6">
          {philosophers.map((philosopher, index) => (
            <div key={philosopher.name} className="relative">
              <div className={`p-3 rounded-lg border ${colorClasses[philosopher.color as keyof typeof colorClasses]} transition-all duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white text-sm font-serif">{philosopher.name}</h4>
                    <p className="text-xs text-slate-400">{philosopher.subtitle}</p>
                  </div>
                  <div className="text-lg opacity-60">
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
                  <div className="bg-slate-600 text-white px-2 py-1 rounded text-xs font-bold">
                    VS
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          
          <button 
            onClick={() => onJoinBattle(id)}
            className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-600/30 text-white px-4 py-2 rounded-lg 
                     hover:bg-slate-700/50 hover:border-slate-500/50 hover:scale-105 
                     active:scale-95 transition-all duration-200 font-medium
                     group-hover:border-yellow-500/30 group-hover:text-yellow-300
                     flex items-center gap-2"
          >
            <Mic className="h-4 w-4" />
            <span>Join Battle</span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-500/5 to-yellow-400/0 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
