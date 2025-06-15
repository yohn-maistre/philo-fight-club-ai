
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BattleCard } from "@/components/BattleCard";
import { DebateArena } from "@/components/DebateArena";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'battles' | 'arena'>('landing');
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);

  const availableBattles = [
    {
      id: "morality-debate",
      title: "The Morality Clash",
      topic: "Objective vs Subjective Morality",
      description: "Is morality a universal truth or a personal construction?",
      philosophers: [
        { 
          name: "Socrates", 
          subtitle: "The Questioner", 
          quote: "I know that I know nothing", 
          color: "emerald" 
        },
        { 
          name: "Nietzsche", 
          subtitle: "The Hammer", 
          quote: "God is dead, and we killed him", 
          color: "red" 
        }
      ],
      duration: "~15 min"
    },
    {
      id: "free-will-debate",
      title: "The Freedom Fight",
      topic: "Free Will vs Determinism",
      description: "Do we truly choose, or are we bound by causation?",
      philosophers: [
        { 
          name: "Descartes", 
          subtitle: "The Dualist", 
          quote: "I think, therefore I am", 
          color: "blue" 
        },
        { 
          name: "Spinoza", 
          subtitle: "The Determinist", 
          quote: "All things are determined by necessity", 
          color: "purple" 
        }
      ],
      duration: "~12 min"
    },
    {
      id: "knowledge-debate",
      title: "The Truth Battle",
      topic: "Rationalism vs Empiricism", 
      description: "Does knowledge come from reason or experience?",
      philosophers: [
        { 
          name: "Kant", 
          subtitle: "The Synthesizer", 
          quote: "All knowledge begins with experience", 
          color: "blue" 
        },
        { 
          name: "Hume", 
          subtitle: "The Skeptic", 
          quote: "Reason is slave to the passions", 
          color: "purple" 
        }
      ],
      duration: "~18 min"
    }
  ];

  const handleEnterArena = () => {
    setCurrentView('battles');
  };

  const handleJoinBattle = (battleId: string) => {
    setSelectedBattle(battleId);
    setCurrentView('arena');
  };

  const handleBackToArena = () => {
    setCurrentView('battles');
    setSelectedBattle(null);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  if (currentView === 'arena' && selectedBattle) {
    return <DebateArena debateId={selectedBattle} onBack={handleBackToArena} />;
  }

  if (currentView === 'battles') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="py-12 px-4 max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <button 
              onClick={handleBackToLanding}
              className="text-slate-400 hover:text-white mb-6 transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-white mb-4 font-serif">Choose Your Battle</h1>
            <p className="text-slate-300 text-lg">Select a philosophical debate to join as Socratic challenger</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBattles.map((battle) => (
              <BattleCard
                key={battle.id}
                {...battle}
                onJoinBattle={handleJoinBattle}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <HeroSection onEnterArena={handleEnterArena} />
    </div>
  );
};

export default Index;
