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
    },
    Descartes: {
      reaction: "(adjusts his coat and looks thoughtful)",
      quote: "You challenge my method of doubt, but observe - even in your questioning, you demonstrate the very certainty I speak of! For you must exist to doubt, and you must think to question. The cogito is not a logical argument but an intuitive certainty that survives all doubt. Can you doubt that you are doubting right now?",
      gesture: "*taps temple with finger*"
    },
    Spinoza: {
      reaction: "(remains calm and composed)",
      quote: "Your question reveals a misunderstanding of freedom itself. True freedom is not the absence of causation, but acting according to one's own nature rather than external compulsion. When we understand the causes that determine us, we achieve the highest form of freedom - that of the wise person who acts from knowledge rather than ignorance.",
      gesture: "*spreads hands in a measured gesture*"
    },
    Kant: {
      reaction: "(straightens his posture with precision)",
      quote: "You raise a penetrating objection! But consider this: reason and experience are not opposed but must work together. Pure concepts without intuition are empty, but intuitions without concepts are blind. The mind actively structures experience through its categories - we do not passively receive knowledge but actively construct it!",
      gesture: "*adjusts spectacles thoughtfully*"
    },
    Hume: {
      reaction: "(chuckles softly with a knowing smile)",
      quote: "Ah, you've touched upon the very heart of my skepticism! Indeed, how can I be certain even of my doubt? But this is precisely my point - custom and habit, not reason, guide most of our beliefs. I cannot prove causation exists, yet I cannot help but believe in it. We are slaves to our human nature, and philosophy must acknowledge its limits!",
      gesture: "*shrugs with philosophical resignation*"
    }
  };

  const response = responses[philosopher as keyof typeof responses];

  // Fallback for unknown philosophers
  if (!response) {
    console.error(`No response data found for philosopher: ${philosopher}`);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p>Error: Unknown philosopher "{philosopher}"</p>
          <Button onClick={onContinue} className="mt-4">Continue</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-green-600/15 border border-green-500/30 text-green-400 text-lg px-6 py-3 mb-6 backdrop-blur-sm">
            ✅ CHALLENGE RESPONDED TO
          </Badge>
          <h1 className="text-3xl font-bold text-white mb-4">
            {philosopher.toUpperCase()} RESPONDS
          </h1>
        </div>

        {/* Philosopher Avatar & Response */}
        <div className="text-center mb-12">
          <div className="w-40 h-40 mx-auto mb-8 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center shadow-lg border border-blue-500/20 backdrop-blur-sm">
            <div className="text-5xl">
              {philosopher === 'Nietzsche' && '🔥'}
              {philosopher === 'Socrates' && '💭'}
              {philosopher === 'Descartes' && '🧠'}
              {philosopher === 'Spinoza' && '⚡'}
              {philosopher === 'Kant' && '🧠'}
              {philosopher === 'Hume' && '⚡'}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">{philosopher.toUpperCase()}</h2>
            <p className="text-slate-400 italic text-lg">{response.reaction}</p>
          </div>
        </div>

        {/* Response Content - Fixed Height */}
        <div className="mb-12">
          <div className="bg-slate-800/20 backdrop-blur-sm rounded-3xl p-10 min-h-[300px] flex items-center justify-center border border-slate-700/30">
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
            className="bg-slate-800/30 hover:bg-slate-700/40 border border-slate-600/30 hover:border-slate-500/40 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-xl text-base backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg"
          >
            <Mic className="h-5 w-5 mr-2" />
            Follow-up Challenge
          </Button>
          
          <Button 
            onClick={onContinue}
            className="bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 hover:border-blue-400/40 text-blue-300 hover:text-blue-200 font-medium px-8 py-4 rounded-xl text-base backdrop-blur-sm transition-all duration-200 hover:scale-105 shadow-lg"
          >
            Continue Debate
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
