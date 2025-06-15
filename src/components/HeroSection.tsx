
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Mic } from "lucide-react";

interface HeroSectionProps {
  onEnterArena: () => void;
}

export const HeroSection = ({ onEnterArena }: HeroSectionProps) => {
  return (
    <section className="relative py-20 px-4 text-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto">
        {/* Main Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 px-4">
            <div className="text-3xl sm:text-4xl">🏛️</div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white font-serif tracking-tight">
              Philosophy
            </h1>
            <div className="text-3xl sm:text-4xl">🥊</div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-serif mb-6">
            FIGHT CLUB
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-300 font-medium mb-8 px-4">
            Challenge Great Minds with Your Voice
          </p>
        </div>

        {/* Hero CTA */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 border border-slate-700/50 max-w-2xl mx-auto">
          <div className="text-3xl mb-4">🎭</div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
            Become the Voice of Inquiry
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed px-2">
            Engage in live voice debates with AI philosophers. 
            <span className="text-yellow-400 font-semibold"> Speak your challenges</span> and hear them respond to your questions in real-time.
          </p>
          
          <InteractiveHoverButton 
            onClick={onEnterArena}
            text="ENTER"
            className="w-48 h-14 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-yellow-500/20 border-yellow-500/30"
          />
          
          <p className="text-slate-400 text-sm mt-4">
            🎤 Real-time voice interaction with AI philosophers
          </p>
        </div>
      </div>
    </section>
  );
};
