
import { useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { BattleCard } from "@/components/BattleCard";
import { DebateArena } from "@/components/DebateArena";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'battles' | 'arena'>('landing');
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);

  const availableBattles = [
    // Classic Philosophy
    {
      id: "morality-debate",
      title: "The Morality Clash",
      topic: "Objective vs Subjective Morality",
      description: "Is morality a universal truth or a personal construction?",
      category: "Classic Philosophy",
      philosophers: [
        { 
          name: "Socrates", 
          subtitle: "The Questioner", 
          quote: "I know that I know nothing", 
          color: "emerald",
          emoji: "💭"
        },
        { 
          name: "Nietzsche", 
          subtitle: "The Hammer", 
          quote: "God is dead, and we killed him", 
          color: "red",
          emoji: "🔥"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "Welcome, my friends, to this inquiry into the nature of morality itself. Today we shall examine whether moral truths exist beyond our individual beliefs, or if each soul must forge its own path to virtue."
      },
      duration: "~15 min"
    },
    {
      id: "free-will-debate",
      title: "The Freedom Fight",
      topic: "Free Will vs Determinism",
      description: "Do we truly choose, or are we bound by causation?",
      category: "Classic Philosophy",
      philosophers: [
        { 
          name: "Descartes", 
          subtitle: "The Dualist", 
          quote: "I think, therefore I am", 
          color: "blue",
          emoji: "🧠"
        },
        { 
          name: "Spinoza", 
          subtitle: "The Determinist", 
          quote: "All things are determined by necessity", 
          color: "purple",
          emoji: "⚡"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "Let us examine the mystery of human choice. Are we truly free to decide our actions, or does necessity govern all? This question touches the very heart of what it means to be human."
      },
      duration: "~12 min"
    },
    {
      id: "knowledge-debate",
      title: "The Truth Battle",
      topic: "Rationalism vs Empiricism", 
      description: "Does knowledge come from reason or experience?",
      category: "Classic Philosophy",
      philosophers: [
        { 
          name: "Kant", 
          subtitle: "The Synthesizer", 
          quote: "All knowledge begins with experience", 
          color: "blue",
          emoji: "⚖️"
        },
        { 
          name: "Hume",
          subtitle: "The Skeptic", 
          quote: "Reason is slave to the passions", 
          color: "purple",
          emoji: "🤔"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "How do we come to know what we know? Through careful reasoning or through the witness of our senses? This ancient question remains as vital today as it was in my time."
      },
      duration: "~18 min"
    },
    
    // Contemporary & Tech
    {
      id: "ai-consciousness-debate",
      title: "The Mind Machine War",
      topic: "AI Consciousness & Human Identity",
      description: "Can machines truly think, and what makes us uniquely human?",
      category: "Technology & Future",
      philosophers: [
        { 
          name: "Alan Turing", 
          subtitle: "The Code Breaker", 
          quote: "Can machines think?", 
          color: "blue",
          emoji: "🤖"
        },
        { 
          name: "John Searle", 
          subtitle: "The Room Keeper", 
          quote: "Syntax is not semantics", 
          color: "red",
          emoji: "🧠"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "What is consciousness? Can silicon and code give birth to genuine thought, or is there something uniquely human about the mind? Let us explore this modern mystery together."
      },
      duration: "~20 min"
    },
    {
      id: "simulation-reality-debate",
      title: "The Reality Glitch",
      topic: "Are We Living in a Simulation?",
      description: "Is our reality authentic or an elaborate digital prison?",
      category: "Technology & Future",
      philosophers: [
        { 
          name: "Nick Bostrom", 
          subtitle: "The Simulator", 
          quote: "We are almost certainly living in a simulation", 
          color: "purple",
          emoji: "🌐"
        },
        { 
          name: "David Chalmers", 
          subtitle: "The Consciousness Detective", 
          quote: "Even simulated experiences are real experiences", 
          color: "blue",
          emoji: "🧩"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "What is real? If we cannot distinguish between authentic and simulated experience, does the distinction matter? This question echoes my own doubts about the nature of reality."
      },
      duration: "~14 min"
    },
    
    // Politics & Society
    {
      id: "capitalism-debate",
      title: "The Economic Showdown",
      topic: "Capitalism vs Democratic Socialism",
      description: "What economic system best serves human flourishing?",
      category: "Politics & Society",
      philosophers: [
        { 
          name: "Adam Smith", 
          subtitle: "The Invisible Hand", 
          quote: "It is not from benevolence we expect our dinner", 
          color: "emerald",
          emoji: "💰"
        },
        { 
          name: "Karl Marx", 
          subtitle: "The Revolutionary", 
          quote: "Workers of the world, unite!", 
          color: "red",
          emoji: "⚡"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "How should we organize society to promote human flourishing? Should markets guide us, or should we consciously direct our economic life? Let us examine the justice of each approach."
      },
      duration: "~25 min"
    },
    {
      id: "privacy-surveillance-debate",
      title: "The Digital Panopticon",
      topic: "Privacy vs Security in the Digital Age",
      description: "How much freedom should we sacrifice for safety?",
      category: "Politics & Society",
      philosophers: [
        { 
          name: "Jeremy Bentham", 
          subtitle: "The Utilitarian", 
          quote: "The greatest good for the greatest number", 
          color: "blue",
          emoji: "👁️"
        },
        { 
          name: "John Stuart Mill", 
          subtitle: "The Libertarian", 
          quote: "The only freedom worth the name is liberty", 
          color: "emerald",
          emoji: "🗽"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "In our connected age, how do we balance collective security with individual privacy? What would a just society choose when these values conflict?"
      },
      duration: "~16 min"
    },
    
    // Cultural & Identity
    {
      id: "gender-nature-debate",
      title: "The Identity Wars",
      topic: "Gender: Biology vs Social Construction",
      description: "What defines gender identity in the 21st century?",
      category: "Cultural & Identity",
      philosophers: [
        { 
          name: "Judith Butler", 
          subtitle: "The Performance Theorist", 
          quote: "Gender is performatively constituted", 
          color: "purple",
          emoji: "🎭"
        },
        { 
          name: "Camille Paglia", 
          subtitle: "The Contrarian", 
          quote: "Biology is not destiny, but it's reality", 
          color: "red",
          emoji: "⚖️"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "What makes us who we are? Is identity something we discover or something we create? These questions about gender touch deeper truths about human nature itself."
      },
      duration: "~22 min"
    },
    {
      id: "cancel-culture-debate",
      title: "The Accountability Arena",
      topic: "Cancel Culture vs Free Speech",
      description: "Where's the line between justice and mob rule?",
      category: "Cultural & Identity",
      philosophers: [
        { 
          name: "John Stuart Mill", 
          subtitle: "The Free Speech Champion", 
          quote: "The peculiar evil of silencing opinion", 
          color: "emerald",
          emoji: "🗣️"
        },
        { 
          name: "Herbert Marcuse", 
          subtitle: "The Critical Theorist", 
          quote: "Repressive tolerance enables oppression", 
          color: "red",
          emoji: "✊"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "When does holding someone accountable become silencing them? How do we distinguish between justice and revenge? These questions test our commitment to both truth and fairness."
      },
      duration: "~17 min"
    },
    
    // Existential & Meaning
    {
      id: "climate-progress-debate",
      title: "The Planetary Crossroads",
      topic: "Climate Action vs Economic Growth",
      description: "Can we save the planet without destroying prosperity?",
      category: "Global Challenges",
      philosophers: [
        { 
          name: "Greta Thunberg", 
          subtitle: "The Climate Warrior", 
          quote: "How dare you steal my dreams!", 
          color: "emerald",
          emoji: "🌍"
        },
        { 
          name: "Bjørn Lomborg", 
          subtitle: "The Skeptical Environmentalist", 
          quote: "Smart solutions beat climate panic", 
          color: "blue",
          emoji: "📊"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "How do we balance our responsibility to future generations with our duty to those alive today? This question demands both wisdom and courage."
      },
      duration: "~19 min"
    },
    {
      id: "death-meaning-debate",
      title: "The Mortality Question",
      topic: "Does Death Give Life Meaning?",
      description: "Would immortality make existence meaningless or perfect?",
      category: "Existential & Meaning",
      philosophers: [
        { 
          name: "Martin Heidegger", 
          subtitle: "The Being Detective", 
          quote: "Being-toward-death gives life authenticity", 
          color: "red",
          emoji: "⚱️"
        },
        { 
          name: "Epicurus", 
          subtitle: "The Pleasure Seeker", 
          quote: "Death is nothing to us", 
          color: "emerald",
          emoji: "🌸"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "What gives life meaning? Does the fact that we die make our time more precious, or is mortality simply an obstacle to human flourishing? Let us face this ultimate question together."
      },
      duration: "~21 min"
    },
    {
      id: "social-media-humanity-debate",
      title: "The Connection Paradox",
      topic: "Digital Connection vs Human Isolation",
      description: "Are we more connected or more alone than ever?",
      category: "Technology & Future",
      philosophers: [
        { 
          name: "Sherry Turkle", 
          subtitle: "The Digital Skeptic", 
          quote: "We're alone together", 
          color: "blue",
          emoji: "📱"
        },
        { 
          name: "Clay Shirky", 
          subtitle: "The Network Optimist", 
          quote: "The internet is the largest experiment in anarchy", 
          color: "purple",
          emoji: "🌐"
        }
      ],
      moderator: {
        name: "Socrates",
        subtitle: "The Great Questioner",
        intro: "Do these new technologies bring us closer together or drive us apart? What is the nature of true connection between souls? Perhaps the tools change, but the questions remain eternal."
      },
      duration: "~13 min"
    }
  ];

  // Group battles by category
  const groupedBattles = availableBattles.reduce((acc, battle) => {
    const category = battle.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(battle);
    return acc;
  }, {} as Record<string, typeof availableBattles>);

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
        <div className="py-8 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <button 
              onClick={handleBackToLanding}
              className="text-slate-400 hover:text-white mb-6 transition-colors"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 font-serif">Philosophical Battle Arena</h1>
            <p className="text-slate-300 text-lg mb-2">Choose your intellectual battleground</p>
            <p className="text-slate-400 text-sm">Moderated by Socrates, the master of inquiry</p>
          </div>

          <div className="space-y-12">
            {Object.entries(groupedBattles).map(([category, battles]) => (
              <div key={category} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl md:text-2xl font-bold text-white font-serif mb-2">{category}</h2>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-slate-500 to-transparent mx-auto"></div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {battles.map((battle) => (
                    <BattleCard
                      key={battle.id}
                      {...battle}
                      onJoinBattle={handleJoinBattle}
                    />
                  ))}
                </div>
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
