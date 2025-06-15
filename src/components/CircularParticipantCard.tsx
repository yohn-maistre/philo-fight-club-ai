
import { Badge } from "@/components/ui/badge";

interface CircularParticipantCardProps {
  name: string;
  subtitle: string;
  color: string;
  isActive: boolean;
  expression?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CircularParticipantCard = ({ 
  name, 
  subtitle, 
  color, 
  isActive, 
  expression,
  size = 'md'
}: CircularParticipantCardProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12 sm:w-16 sm:h-16',
    md: 'w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24',
    lg: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32'
  };

  const iconSizes = {
    sm: 'text-sm sm:text-lg',
    md: 'text-lg sm:text-xl md:text-2xl',
    lg: 'text-xl sm:text-2xl md:text-3xl'
  };

  const getIcon = () => {
    switch (color) {
      case 'emerald': return '💭';
      case 'red': return '🔥';
      case 'blue': return '🧠';
      case 'purple': return '⚡';
      case 'amber': return '⚖️';
      default: return '🎭';
    }
  };

  const colorMap = {
    emerald: 'border-emerald-400 bg-emerald-500/10',
    red: 'border-red-400 bg-red-500/10',
    blue: 'border-blue-400 bg-blue-500/10',
    purple: 'border-purple-400 bg-purple-500/10',
    amber: 'border-amber-400 bg-amber-500/10'
  };

  return (
    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
      <div className={`
        ${sizeClasses[size]} 
        rounded-full 
        border-2 
        ${colorMap[color as keyof typeof colorMap] || 'border-slate-400 bg-slate-500/10'}
        ${isActive ? 'ring-2 sm:ring-4 ring-white/20 scale-105 sm:scale-110' : ''}
        backdrop-blur-sm 
        flex items-center justify-center 
        transition-all duration-300
        relative
      `}>
        <div className={iconSizes[size]}>
          {getIcon()}
        </div>
        {isActive && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
        )}
      </div>
      
      <div className="text-center">
        <h4 className="font-bold text-white text-xs sm:text-sm font-serif truncate max-w-16 sm:max-w-20">{name}</h4>
        <Badge className="text-xs px-1 sm:px-2 py-0.5 bg-slate-600/30 text-slate-300 border-slate-500/30 hidden sm:inline-flex">
          {subtitle}
        </Badge>
        {isActive && (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs mt-1">
            SPEAKING
          </Badge>
        )}
        {!isActive && expression && (
          <p className="text-slate-400 text-xs italic mt-1 max-w-16 sm:max-w-20 truncate hidden md:block">
            {expression}
          </p>
        )}
      </div>
    </div>
  );
};
