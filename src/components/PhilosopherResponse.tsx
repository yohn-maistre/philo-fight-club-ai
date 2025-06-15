
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Target, Zap, Mic, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-serif">
            🔥 {philosopher.toUpperCase()} RESPONDS TO YOUR CHALLENGE
          </h1>
        </div>

        {/* Response Card */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="text-2xl">{philosopher === 'Nietzsche' ? '🔥' : '💭'}</div>
                <h2 className="text-xl font-bold text-white font-serif">{philosopher.toUpperCase()}:</h2>
                <span className="text-slate-400">{response.reaction}</span>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-6 mb-4">
              <p className="text-slate-200 text-lg leading-relaxed italic mb-4">
                🗣️ "{response.quote}"
              </p>
              <p className="text-slate-400 text-center">
                🎭 {response.gesture}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Challenge Result */}
        <Card className="bg-slate-800/50 border-slate-700 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-bold text-white">CHALLENGE RESULT:</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Philosophical Impact: </span>
                  <Badge className="bg-green-600 text-white">HIGH</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">{philosopher}'s Defense: </span>
                  <Badge className="bg-blue-600 text-white">CREATIVE</Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Your Socratic Skill: </span>
                  <Badge className="bg-purple-600 text-white">IMPROVING</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">You forced {philosopher} to refine their position!</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-slate-300">Socrates would be proud of that question!</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-yellow-400 font-bold text-lg">+15 Socratic Points</span>
                  <br />
                  <span className="text-green-400">+1 "Gotcha Moment" (Partial)</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl mb-2">🏆</div>
                  <span className="text-slate-400 text-sm">Achievement Unlocked!</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button 
            onClick={onNewChallenge}
            className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold px-6 py-3"
          >
            <Mic className="h-4 w-4 mr-2" />
            Follow-up Challenge
          </Button>
          
          <Button 
            onClick={onContinue}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold px-6 py-3"
          >
            📝 Let Debate Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};
