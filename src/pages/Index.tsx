
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BattleCard } from "@/components/BattleCard";
import { ModernDebateArena } from "@/components/ModernDebateArena";
import { PreBattleBriefing } from "@/components/PreBattleBriefing";
import { PostBattleResults } from "@/components/PostBattleResults";
import { ChallengeLibrary } from "@/components/ChallengeLibrary";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'battles' | 'briefing' | 'arena' | 'results' | 'library'>('landing');
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
    setCurrentView('briefing');
  };

  const handleStartBattle = () => {
    setCurrentView('arena');
  };

  const handleBattleComplete = () => {
    setCurrentView('results');
  };

  const handleBackToArena = () => {
    setCurrentView('battles');
    setSelectedBattle(null);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleOpenLibrary = () => {
    setCurrentView('library');
  };

  // Route to different views
  if (currentView === 'arena' && selectedBattle) {
    return <ModernDebateArena debateId={selectedBattle} onBack={handleBackToArena} />;
  }

  if (currentView === 'briefing' && selectedBattle) {
    return (
      <PreBattleBriefing 
        battleId={selectedBattle} 
        onStart={handleStartBattle}
        onBack={handleBackToArena} 
      />
    );
  }

  if (currentView === 'results') {
    return (
      <PostBattleResults
        onChallengeAgain={handleStartBattle}
        onNewBattle={handleBackToArena}
        onBackToMenu={handleBackToLanding}
      />
    );
  }

  if (currentView === 'library') {
    return (
      <ChallengeLibrary
        onBack={handleBackToArena}
        onPractice={(challenge) => console.log('Practice:', challenge)}
      />
    );
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
            <p className="text-slate-300 text-lg mb-6">Select a philosophical debate to join as Socratic challenger</p>
            
            <button
              onClick={handleOpenLibrary}
              className="text-yellow-400 hover:text-yellow-300 transition-colors mb-8 underline"
            >
              📚 Browse Challenge Library First
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBattles.map((battle, index) => (
              <div 
                key={battle.id}
                className="animate-slide-up-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <BattleCard
                  {...battle}
                  onJoinBattle={handleJoinBattle}
                />
              </div>
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
