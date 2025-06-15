
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic } from "lucide-react";
import { GoldenParticles } from "./GoldenParticles";
import { DynamicBackground } from "./DynamicBackground";

interface HeroSectionProps {
  onEnterArena: () => void;
}

export const HeroSection = ({ onEnterArena }: HeroSectionProps) => {
  return (
    <section className="relative py-20 px-4 text-center overflow-hidden min-h-screen flex items-center">
      {/* Dynamic Background Elements */}
      <DynamicBackground />
      <GoldenParticles />
      
      <div className="relative max-w-4xl mx-auto z-10">
        {/* Main Title */}
        <div className="mb-12 animate-slide-up-fade">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="text-4xl animate-bounce">🏛️</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-serif tracking-tight">
              Philosophy
            </h1>
            <div className="text-4xl animate-bounce animate-delay-200">🥊</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-serif mb-6 animate-pulse-glow">
            FIGHT CLUB
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-medium mb-8 animate-slide-up-fade animate-delay-300">
            Challenge Great Minds with Socratic Questions
          </p>
        </div>

        {/* Hero CTA */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 max-w-2xl mx-auto animate-slide-up-fade animate-delay-500">
          <div className="text-3xl mb-4 animate-float">🎭</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
            Become the Socratic Challenger
          </h2>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
            Listen to philosophical debates between great thinkers. 
            <span className="text-yellow-400 font-semibold"> Interrupt with your questions</span> and watch them respond to your challenges.
          </p>
          
          <Button 
            onClick={onEnterArena}
            size="lg"
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold text-lg px-8 py-3 transform hover:scale-105 transition-all duration-200 animate-pulse-glow hover:animate-none"
          >
            <Mic className="h-5 w-5 mr-2" />
            Enter the Arena
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
