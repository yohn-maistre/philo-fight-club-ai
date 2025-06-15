
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Users, Star } from "lucide-react";

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
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-4xl">🏛️</div>
            <h1 className="text-5xl md:text-7xl font-bold text-white font-serif tracking-tight">
              Philosophy
            </h1>
            <div className="text-4xl">🥊</div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent font-serif mb-4">
            FIGHT CLUB
          </h1>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
            <p className="text-xl md:text-2xl text-slate-300 font-medium">
              WHERE GREAT MINDS CLASH
            </p>
            <Star className="h-6 w-6 text-yellow-400 animate-pulse" />
          </div>
        </div>

        {/* Hero CTA Box */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-slate-700 max-w-2xl mx-auto">
          <div className="text-3xl mb-4">🎭</div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 font-serif">
            BECOME THE SOCRATIC CHALLENGER
          </h2>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
            Don't just listen to philosophical debates... 
            <span className="text-yellow-400 font-semibold"> INTERRUPT THEM!</span>
            <br />
            Challenge the greatest minds in history with your own questions 
            and see how they respond to your Socratic challenges.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onEnterArena}
              size="lg"
              className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold text-lg px-8 py-3 transform hover:scale-105 transition-all duration-200"
            >
              <Mic className="h-5 w-5 mr-2" />
              ENTER THE ARENA
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white font-semibold px-8 py-3"
            >
              📚 LEARN MORE
            </Button>
          </div>
        </div>

        {/* Social Proof */}
        <div className="flex items-center justify-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-sm">Join 10,000+ critical thinkers</span>
          </div>
          <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span className="text-sm">4.9/5 from philosophy professors</span>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 text-2xl opacity-50 animate-bounce" style={{ animationDelay: '0.5s' }}>
          💭
        </div>
        <div className="absolute top-32 right-16 text-2xl opacity-50 animate-bounce" style={{ animationDelay: '1s' }}>
          ❓
        </div>
        <div className="absolute bottom-20 left-20 text-2xl opacity-50 animate-bounce" style={{ animationDelay: '1.5s' }}>
          ⚡
        </div>
      </div>
    </section>
  );
};
