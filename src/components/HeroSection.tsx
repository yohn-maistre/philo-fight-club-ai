import { Hero } from "@/components/ui/hero";
import { Mic, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onEnterArena: () => void;
}

export const HeroSection = ({ onEnterArena }: HeroSectionProps) => {
  const title = (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="text-4xl">🏛️</div>
        <span className="text-5xl md:text-7xl font-medium text-white font-serif tracking-tight">
          Philosophy
        </span>
        <div className="text-4xl">🥊</div>
      </div>
      <span className="text-4xl md:text-6xl font-medium bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-serif">
        FIGHT CLUB
      </span>
    </div>
  );

  const actions = [
    {
      label: (
        <div className="flex items-center">
          <Mic className="h-6 w-6 mr-3 animate-pulse" />
          START VOICE DEBATE
          <ArrowRight className="h-6 w-6 ml-3" />
        </div>
      ) as any,
      onClick: onEnterArena,
      variant: "default" as const,
    }
  ];

  return (
    <Hero
      title={title}
      subtitle="Challenge Great Minds with Your Voice - Real-time voice interaction with AI philosophers"
      actions={actions}
      className="min-h-[90vh] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      titleClassName="font-serif"
      subtitleClassName="text-xl md:text-2xl text-slate-300 font-medium max-w-3xl"
      actionsClassName="mt-8"
    />
  );
};
