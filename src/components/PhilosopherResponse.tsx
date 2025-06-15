
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, ArrowRight } from "lucide-react";

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
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-green-500/10 border border-green-500/20 text-green-400 text-lg px-6 py-3 mb-6 backdrop-blur-sm">
            ✅ CHALLENGE RESPONDED TO
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-4">
            {philosopher.toUpperCase()} RESPONDS
          </h1>
        </div>

        {/* Philosopher Avatar & Response */}
        <div className="text-center mb-12">
          <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <div className="text-5xl">
              {philosopher === 'Nietzsche' ? '🔥' : '💭'}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{philosopher.toUpperCase()}</h2>
            <p className="text-slate-400 italic text-lg">{response.reaction}</p>
          </div>
        </div>

        {/* Response Content - Fixed Height */}
        <div className="mb-12">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-3xl p-10 min-h-[300px] flex items-center justify-center">
            <div className="text-center max-w-4xl">
              <p className="text-slate-200 text-xl leading-relaxed mb-8">
                "{response.quote}"
              </p>
              <p className="text-slate-400 italic text-lg">
                {response.gesture}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <Button 
            onClick={onNewChallenge}
            className="bg-slate-800/50 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500/70 text-white font-medium px-8 py-4 rounded-xl text-base backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Mic className="h-5 w-5 mr-2" />
            Follow-up Challenge
          </Button>
          
          <Button 
            onClick={onContinue}
            className="bg-blue-600/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-400/50 text-blue-300 hover:text-blue-200 font-medium px-8 py-4 rounded-xl text-base backdrop-blur-sm transition-all duration-200 hover:scale-105"
          >
            Continue Debate
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
