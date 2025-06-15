
import { Badge } from "@/components/ui/badge";

interface PhilosopherCardProps {
  name: string;
  subtitle: string;
  quote: string;
  color: string;
  isVersus?: boolean;
}

export const PhilosopherCard = ({ name, subtitle, quote, color, isVersus }: PhilosopherCardProps) => {
  const colorClasses = {
    emerald: "border-emerald-500 bg-emerald-500/10",
    red: "border-red-500 bg-red-500/10", 
    blue: "border-blue-500 bg-blue-500/10",
    purple: "border-purple-500 bg-purple-500/10"
  };

  return (
    <div className="relative">
      <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} transition-all duration-300 hover:scale-105`}>
        <div className="text-center">
          <h4 className="font-bold text-white text-lg font-serif">{name}</h4>
          <Badge variant="secondary" className="text-xs mb-2">
            {subtitle}
          </Badge>
          <p className="text-slate-300 text-sm italic">"{quote}"</p>
        </div>
      </div>
      
      {isVersus && (
        <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-slate-700 text-white px-2 py-1 rounded text-xs font-bold">
            ⚔️ VS
          </div>
        </div>
      )}
    </div>
  );
};
