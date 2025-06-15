
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic } from "lucide-react";
import { TypeWriter } from "./TypeWriter";
import { FloatingElements } from "./FloatingElements";

interface HeroSectionProps {
  onEnterArena: () => void;
}

export const HeroSection = ({ onEnterArena }: HeroSectionProps) => {
  return (
    <section className="relative py-20 px-4 text-center overflow-hidden min-h-screen flex items-center">
      <FloatingElements />
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-900/20 to-slate-900 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-transparent to-blue-900/10 animate-gradient-shift-reverse"></div>
      </div>
      
      {/* Geometric Background Patterns */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-yellow-400 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border border-emerald-400 rotate-12 animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 bg-blue-400 rounded-full animate-bounce-slow"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto z-10">
        {/* Main Title */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in">
            <div className="text-4xl animate-bounce">🏛️</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-serif tracking-tight">
              Philosophy
            </h1>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🥊</div>
          </div>
          
          {/* Glowing Fight Club Title */}
          <h1 className="text-4xl md:text-6xl font-bold font-serif mb-6 relative">
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent animate-glow">
              FIGHT CLUB
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent blur-sm opacity-50 animate-pulse">
              FIGHT CLUB
            </div>
          </h1>
          
          <div className="text-xl md:text-2xl text-slate-300 font-medium mb-8">
            <TypeWriter 
              text="Challenge Great Minds with Socratic Questions"
              className="inline-block"
              speed={80}
              delay={1000}
            />
          </div>
        </div>

        {/* Hero CTA */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700/50 max-w-2xl mx-auto hover:bg-slate-800/40 transition-all duration-500 hover:scale-105 hover:border-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-400/20">
          <div className="text-3xl mb-4 animate-bounce">🎭</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
            Become the Socratic Challenger
          </h2>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
            Listen to philosophical debates between great thinkers. 
            <span className="text-yellow-400 font-semibold animate-pulse"> Interrupt with your questions</span> and watch them respond to your challenges.
          </p>
          
          <Button 
            onClick={onEnterArena}
            size="lg"
            className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold text-lg px-8 py-3 transform hover:scale-110 transition-all duration-300 animate-pulse-gentle shadow-lg hover:shadow-yellow-400/50"
          >
            <Mic className="h-5 w-5 mr-2 animate-pulse" />
            Enter the Arena
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Philosophy Icons */}
        <div className="flex justify-center gap-8 text-3xl opacity-60 mt-8">
          <span className="animate-bounce" style={{ animationDelay: '0s' }}>📚</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🗿</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>⚖️</span>
          <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>💭</span>
          <span className="animate-bounce" style={{ animationDelay: '0.8s' }}>💡</span>
        </div>
      </div>
    </section>
  );
};
