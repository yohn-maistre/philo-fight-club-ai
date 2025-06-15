
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Target, Zap, Mic, ArrowRight, Clock } from "lucide-react";

interface PhilosopherResponseProps {
  philosopher: string;
  onContinue: () => void;
  onNewChallenge: () => void;
}

export const PhilosopherResponse = ({ philosopher, onContinue, onNewChallenge }: PhilosopherResponseProps) => {
  const responses = {
    Nietzsche: {
      reaction: "(pauses, then grins wickedly)",
      quote: "Aha! You seek to trap me with my own words, you clever challenger! But you misunderstand - I do not claim universal truth about strength. I CREATE the meaning of strength through my will to power! The strong define what strength means by their very existence. I am not bound by your need for universal standards!",
      gesture: "*adjusts mustache dramatically*"
    },
    Socrates: {
      reaction: "(strokes beard thoughtfully)",
      quote: "My young friend, you ask an excellent question! Indeed, how can I speak of knowing nothing while claiming to know that I know nothing? Perhaps... perhaps even this claim should be examined. Are you suggesting that my ignorance itself might be an assumption? Tell me, what do you think it means to truly know something?",
      gesture: "*leans forward with genuine curiosity*"
    }
  };

  const response = responses[philosopher as keyof typeof responses];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header - Challenge Result Badge */}
        <div className="text-center mb-8">
          <Badge className="bg-green-500 hover:bg-green-600 text-white text-lg px-6 py-3 mb-4">
            ✅ CHALLENGE RESPONDED TO
          </Badge>
          <h1 className="text-2xl font-bold text-white mb-2">
            {philosopher.toUpperCase()} DEFENDS THEIR POSITION
          </h1>
        </div>

        {/* Philosopher Avatar & Response */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="text-4xl">
              {philosopher === 'Nietzsche' ? '🔥' : '💭'}
            </div>
          </div>
          
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-2">{philosopher.toUpperCase()}</h2>
            <p className="text-slate-400 italic">{response.reaction}</p>
          </div>
        </div>

        {/* Response Content - Fixed Height */}
        <div className="mb-8">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 min-h-[300px] flex items-center justify-center">
            <div className="text-center max-w-3xl">
              <p className="text-slate-200 text-xl leading-relaxed mb-6">
                "{response.quote}"
              </p>
              <p className="text-slate-400 italic">
                {response.gesture}
              </p>
            </div>
          </div>
        </div>

        {/* Challenge Impact Analysis */}
        <div className="bg-slate-800/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-yellow-400" />
            <h3 className="text-lg font-bold text-white">CHALLENGE IMPACT</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">Philosophical Impact</span>
              </div>
              <Badge className="bg-green-600 text-white text-lg px-4 py-2">HIGH</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">{philosopher}'s Defense</span>
              </div>
              <Badge className="bg-blue-600 text-white text-lg px-4 py-2">CREATIVE</Badge>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="h-4 w-4 text-yellow-400" />
                <span className="text-slate-300 text-sm">Your Skill</span>
              </div>
              <Badge className="bg-purple-600 text-white text-lg px-4 py-2">IMPROVING</Badge>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 rounded-xl p-6 border border-yellow-500/20">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-yellow-400 font-bold text-xl">+15 Socratic Points</span>
                <br />
                <span className="text-green-400 text-lg">+1 "Gotcha Moment" (Partial)</span>
                <br />
                <span className="text-slate-300 text-sm mt-2 block">You forced {philosopher} to refine their position!</span>
              </div>
              <div className="text-right">
                <div className="text-4xl mb-2">🏆</div>
                <span className="text-slate-400 text-sm">Achievement!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <Button 
            onClick={onNewChallenge}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:transform hover:scale-105 transition-all"
          >
            <Mic className="h-5 w-5 mr-3" />
            Follow-up Challenge
          </Button>
          
          <Button 
            onClick={onContinue}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold px-8 py-4 rounded-xl text-lg hover:transform hover:scale-105 transition-all"
          >
            Let Debate Continue
            <ArrowRight className="h-5 w-5 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
