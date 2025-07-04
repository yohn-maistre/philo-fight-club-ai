import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BattleCard } from "@/components/BattleCard";
import { DebateArena } from "@/components/DebateArena";
import { MarqueeAnimation } from "@/components/ui/marquee-effect";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { BookOpen, Zap, Flame, Skull, Lock } from "lucide-react";
import { getSquadConfig } from "@/config/squadConfigs";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'battles' | 'arena'>('landing');
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);

  const availableBattles = [
    // Classic Philosophy - Squad Enabled
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
      duration: "~15 min",
      category: "classic",
      isSquadEnabled: true
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
      duration: "~12 min",
      category: "classic",
      isSquadEnabled: true
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
      duration: "~18 min",
      category: "classic",
      isSquadEnabled: true
    },
    
    // Contemporary & Highly Relevant - Locked for now
    {
      id: "ai-consciousness-debate",
      title: "The Mind Machine War",
      topic: "AI Consciousness & Human Identity",
      description: "Can machines truly think, and what makes us uniquely human?",
      philosophers: [
        { 
          name: "Alan Turing", 
          subtitle: "The Code Breaker", 
          quote: "Can machines think?", 
          color: "blue" 
        },
        { 
          name: "John Searle", 
          subtitle: "The Room Keeper", 
          quote: "Syntax is not semantics", 
          color: "red" 
        }
      ],
      duration: "~20 min",
      category: "modern",
      isSquadEnabled: false
    },
    {
      id: "capitalism-debate",
      title: "The Economic Showdown",
      topic: "Capitalism vs Democratic Socialism",
      description: "What economic system best serves human flourishing?",
      philosophers: [
        { 
          name: "Adam Smith", 
          subtitle: "The Invisible Hand", 
          quote: "It is not from benevolence we expect our dinner", 
          color: "emerald" 
        },
        { 
          name: "Karl Marx", 
          subtitle: "The Revolutionary", 
          quote: "Workers of the world, unite!", 
          color: "red" 
        }
      ],
      duration: "~25 min",
      category: "modern",
      isSquadEnabled: false
    },
    {
      id: "privacy-surveillance-debate",
      title: "The Digital Panopticon",
      topic: "Privacy vs Security in the Digital Age",
      description: "How much freedom should we sacrifice for safety?",
      philosophers: [
        { 
          name: "Jeremy Bentham", 
          subtitle: "The Utilitarian", 
          quote: "The greatest good for the greatest number", 
          color: "blue" 
        },
        { 
          name: "John Stuart Mill", 
          subtitle: "The Libertarian", 
          quote: "The only freedom worth the name is liberty", 
          color: "emerald" 
        }
      ],
      duration: "~16 min",
      category: "modern",
      isSquadEnabled: false
    },
    
    // Provocative Modern Issues
    {
      id: "simulation-reality-debate",
      title: "The Reality Glitch",
      topic: "Are We Living in a Simulation?",
      description: "Is our reality authentic or an elaborate digital prison?",
      philosophers: [
        { 
          name: "Nick Bostrom", 
          subtitle: "The Simulator", 
          quote: "We are almost certainly living in a simulation", 
          color: "purple" 
        },
        { 
          name: "David Chalmers", 
          subtitle: "The Consciousness Detective", 
          quote: "Even simulated experiences are real experiences", 
          color: "blue" 
        }
      ],
      duration: "~14 min",
      category: "provocative",
      isSquadEnabled: false
    },
    {
      id: "gender-nature-debate",
      title: "The Identity Wars",
      topic: "Gender: Biology vs Social Construction",
      description: "What defines gender identity in the 21st century?",
      philosophers: [
        { 
          name: "Judith Butler", 
          subtitle: "The Performance Theorist", 
          quote: "Gender is performatively constituted", 
          color: "purple" 
        },
        { 
          name: "Camille Paglia", 
          subtitle: "The Contrarian", 
          quote: "Biology is not destiny, but it's reality", 
          color: "red" 
        }
      ],
      duration: "~22 min",
      category: "provocative",
      isSquadEnabled: false
    },
    {
      id: "climate-progress-debate",
      title: "The Planetary Crossroads",
      topic: "Climate Action vs Economic Growth",
      description: "Can we save the planet without destroying prosperity?",
      philosophers: [
        { 
          name: "Greta Thunberg", 
          subtitle: "The Climate Warrior", 
          quote: "How dare you steal my dreams!", 
          color: "emerald" 
        },
        { 
          name: "Bjørn Lomborg", 
          subtitle: "The Skeptical Environmentalist", 
          quote: "Smart solutions beat climate panic", 
          color: "blue" 
        }
      ],
      duration: "~19 min",
      category: "provocative",
      isSquadEnabled: false
    },
    
    // Wild Cards & Cultural Battles
    {
      id: "cancel-culture-debate",
      title: "The Accountability Arena",
      topic: "Cancel Culture vs Free Speech",
      description: "Where's the line between justice and mob rule?",
      philosophers: [
        { 
          name: "John Stuart Mill", 
          subtitle: "The Free Speech Champion", 
          quote: "The peculiar evil of silencing opinion", 
          color: "emerald" 
        },
        { 
          name: "Herbert Marcuse", 
          subtitle: "The Critical Theorist", 
          quote: "Repressive tolerance enables oppression", 
          color: "red" 
        }
      ],
      duration: "~17 min",
      category: "wild",
      isSquadEnabled: false
    },
    {
      id: "social-media-humanity-debate",
      title: "The Connection Paradox",
      topic: "Digital Connection vs Human Isolation",
      description: "Are we more connected or more alone than ever?",
      philosophers: [
        { 
          name: "Sherry Turkle", 
          subtitle: "The Digital Skeptic", 
          quote: "We're alone together", 
          color: "blue" 
        },
        { 
          name: "Clay Shirky", 
          subtitle: "The Network Optimist", 
          quote: "The internet is the largest experiment in anarchy", 
          color: "purple" 
        }
      ],
      duration: "~13 min",
      category: "wild",
      isSquadEnabled: false
    },
    {
      id: "death-meaning-debate",
      title: "The Mortality Question",
      topic: "Does Death Give Life Meaning?",
      description: "Would immortality make existence meaningless or perfect?",
      philosophers: [
        { 
          name: "Martin Heidegger", 
          subtitle: "The Being Detective", 
          quote: "Being-toward-death gives life authenticity", 
          color: "red" 
        },
        { 
          name: "Epicurus", 
          subtitle: "The Pleasure Seeker", 
          quote: "Death is nothing to us", 
          color: "emerald" 
        }
      ],
      duration: "~21 min",
      category: "wild",
      isSquadEnabled: false
    }
  ];

  const categoryTabs = [
    { title: "Classic", icon: BookOpen },
    { title: "Modern", icon: Zap },
    { title: "Provocative", icon: Flame },
    { title: "Wild Cards", icon: Skull }
  ];

  const categoryMap = {
    0: "classic",
    1: "modern", 
    2: "provocative",
    3: "wild"
  };

  const filteredBattles = selectedCategory !== null 
    ? availableBattles.filter(battle => battle.category === categoryMap[selectedCategory as keyof typeof categoryMap])
    : availableBattles.filter(battle => battle.category === "classic");

  const handleEnterArena = () => {
    setCurrentView('battles');
  };

  const handleJoinBattle = (battleId: string) => {
    const battle = availableBattles.find(b => b.id === battleId);
    if (battle && !battle.isSquadEnabled) {
      return; // Prevent joining locked battles
    }
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
        <div className="py-12 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <button 
              onClick={handleBackToLanding}
              className="text-slate-400 hover:text-white mb-6 transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-4xl font-bold text-white mb-4 font-serif">Choose Your Philosophical Battle</h1>
            <p className="text-slate-300 text-lg mb-2">Select a debate to join as Socratic challenger</p>
            
            {/* Squad Moderator Badge */}
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-slate-800/20 backdrop-blur-sm border border-slate-600/20 rounded-full">
              <div className="relative">
                <div className="w-8 h-8 bg-slate-700/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-600/30">
                  <span className="text-slate-300 text-sm">🧠</span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border border-slate-800"></div>
              </div>
              <span className="text-slate-300 font-medium text-sm font-serif">Squad-Powered Debates</span>
            </div>
            
            {/* Category Tabs */}
            <div className="flex justify-center mb-8">
              <ExpandableTabs 
                tabs={categoryTabs}
                onChange={setSelectedCategory}
                activeColor="text-yellow-400"
                className="bg-slate-800/30"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBattles.map((battle) => (
              <div key={battle.id} className="relative">
                <BattleCard
                  {...battle}
                  onJoinBattle={handleJoinBattle}
                />
                {!battle.isSquadEnabled && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center border border-slate-600/30">
                    <div className="text-center">
                      <Lock className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-300 font-medium text-sm">Coming Soon</p>
                      <p className="text-slate-500 text-xs">Squad configuration in progress</p>
                    </div>
                  </div>
                )}
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
      
      {/* Philosophy Fight Club Marquee */}
      <div className="py-8 border-t border-b border-slate-700/50">
        <MarqueeAnimation
          direction="left"
          baseVelocity={-2}
          className="bg-yellow-400 text-slate-900 py-4 text-2xl md:text-4xl font-serif tracking-wide font-bold"
        >
          The first rule of Philosophy Fight Club is: you MUST talk about Philosophy Fight Club
        </MarqueeAnimation>
      </div>
    </div>
  );
};

export default Index;
