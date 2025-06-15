
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeroSection } from "@/components/HeroSection";
import { PhilosopherCard } from "@/components/PhilosopherCard";
import { DebateArena } from "@/components/DebateArena";
import { Mic, Users, Star, Clock } from "lucide-react";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'arena'>('landing');
  const [selectedDebate, setSelectedDebate] = useState<string | null>(null);

  const featuredDebates = [
    {
      id: "morality",
      title: "The Morality Massacre",
      topic: "Is morality objective or subjective?",
      philosophers: [
        { name: "Socrates", subtitle: "The Questioner", quote: "I know nothing...", color: "emerald" },
        { name: "Nietzsche", subtitle: "The Hammer", quote: "God is dead!", color: "red" }
      ],
      isLive: true,
      participants: 1247
    },
    {
      id: "free-will",
      title: "The Freedom Fight",
      topic: "Do we have free will or are we determined?",
      philosophers: [
        { name: "Descartes", subtitle: "The Dualist", quote: "I think, therefore I am", color: "blue" },
        { name: "Spinoza", subtitle: "The Determinist", quote: "All is necessity", color: "purple" }
      ],
      isLive: false,
      participants: 892
    }
  ];

  const enterArena = (debateId: string) => {
    setSelectedDebate(debateId);
    setCurrentView('arena');
  };

  if (currentView === 'arena' && selectedDebate) {
    return <DebateArena debateId={selectedDebate} onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <HeroSection onEnterArena={() => setCurrentView('arena')} />
      
      {/* Featured Debates Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white font-serif">Tonight's Featured Battles</h2>
            <Star className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-slate-300 text-lg">Where great minds clash and you decide the victor</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {featuredDebates.map((debate) => (
            <Card key={debate.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white font-serif">{debate.title}</h3>
                  {debate.isLive && (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white animate-pulse">
                      🔴 LIVE NOW
                    </Badge>
                  )}
                </div>
                
                <p className="text-slate-300 mb-6 italic">"{debate.topic}"</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {debate.philosophers.map((philosopher, index) => (
                    <PhilosopherCard
                      key={philosopher.name}
                      name={philosopher.name}
                      subtitle={philosopher.subtitle}
                      quote={philosopher.quote}
                      color={philosopher.color}
                      isVersus={index === 0}
                    />
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-slate-400 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{debate.participants} listening</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>~15 min</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => enterArena(debate.id)}
                    className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-semibold group-hover:scale-105 transition-transform"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Join Battle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 font-serif">How to Become a Socratic Challenger</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Listen to Great Minds",
                description: "Philosophers debate complex topics in real-time"
              },
              {
                step: "2", 
                title: "Interrupt with Questions",
                description: "Challenge their logic with Socratic method"
              },
              {
                step: "3",
                title: "Watch Them Respond",
                description: "See how they defend their positions"
              }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h4 className="text-lg font-semibold text-white mb-2">{item.title}</h4>
                <p className="text-slate-300">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
