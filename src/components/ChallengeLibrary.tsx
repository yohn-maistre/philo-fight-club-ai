
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Play, Target, TrendingUp } from "lucide-react";

interface ChallengeLibraryProps {
  onBack: () => void;
  onPractice: (challenge: string) => void;
}

export const ChallengeLibrary = ({ onBack, onPractice }: ChallengeLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "All Categories", icon: "🎯" },
    { id: "definition", name: "Definition Seeking", icon: "❓" },
    { id: "contradiction", name: "Contradiction Hunting", icon: "⚡" },
    { id: "assumption", name: "Assumption Challenging", icon: "💭" },
    { id: "example", name: "Example Demanding", icon: "📝" },
  ];

  const challenges = [
    {
      id: 1,
      question: "What exactly do you mean by that?",
      category: "definition",
      difficulty: "Beginner",
      successRate: 89,
      usage: 1247,
      effectiveAgainst: ["Abstract concepts", "Vague statements"],
      example: "When Nietzsche says 'strength', ask what he means by strength."
    },
    {
      id: 2,
      question: "But aren't you contradicting yourself when you say...?",
      category: "contradiction",
      difficulty: "Advanced",
      successRate: 76,
      usage: 892,
      effectiveAgainst: ["Absolute statements", "Logical inconsistencies"],
      example: "Point out when someone makes universal claims but acts differently."
    },
    {
      id: 3,
      question: "What assumptions are you making here?",
      category: "assumption",
      difficulty: "Intermediate",
      successRate: 82,
      usage: 654,
      effectiveAgainst: ["Unexamined beliefs", "Hidden premises"],
      example: "Challenge underlying beliefs about human nature or society."
    },
    {
      id: 4,
      question: "Can you give me a concrete example?",
      category: "example",
      difficulty: "Beginner",
      successRate: 91,
      usage: 1456,
      effectiveAgainst: ["Abstract theories", "General statements"],
      example: "When philosophers make broad claims, demand specific instances."
    },
    {
      id: 5,
      question: "How do you know that's true?",
      category: "assumption",
      difficulty: "Intermediate",
      successRate: 78,
      usage: 743,
      effectiveAgainst: ["Unsupported claims", "Appeals to authority"],
      example: "Question the evidence behind their confident assertions."
    },
  ];

  const filteredChallenges = challenges.filter(challenge => {
    const matchesSearch = challenge.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.example.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-600";
      case "Intermediate": return "bg-yellow-600";
      case "Advanced": return "bg-red-600";
      default: return "bg-slate-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack} className="text-slate-300 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2 font-serif">Challenge Library</h1>
            <p className="text-slate-300">Master the art of Socratic questioning</p>
          </div>
          
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search challenges or examples..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`${
                  selectedCategory === category.id 
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Challenge Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredChallenges.map(challenge => (
            <Card key={challenge.id} className="bg-slate-800/40 border-slate-700 hover:bg-slate-800/60 transition-all backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Challenge Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      "{challenge.question}"
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                        {challenge.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300">
                        {categories.find(c => c.id === challenge.category)?.icon} {categories.find(c => c.id === challenge.category)?.name}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{challenge.successRate}%</div>
                    <p className="text-slate-400 text-xs">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{challenge.usage}</div>
                    <p className="text-slate-400 text-xs">Times Used</p>
                  </div>
                </div>

                {/* Example */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">💡 Example Usage:</h4>
                  <p className="text-slate-300 text-sm italic">"{challenge.example}"</p>
                </div>

                {/* Effective Against */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-2">🎯 Effective Against:</h4>
                  <div className="flex flex-wrap gap-1">
                    {challenge.effectiveAgainst.map((target, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-700 text-slate-300">
                        {target}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onPractice(challenge.question)}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white"
                  >
                    <Play className="h-4 w-4 mr-2"  />
                    Practice
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredChallenges.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No challenges found</h3>
            <p className="text-slate-400">Try adjusting your search or category filter</p>
          </div>
        )}
      </div>
    </div>
  );
};
