
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Zap, RotateCcw, ArrowRight } from "lucide-react";

interface PostBattleResultsProps {
  onChallengeAgain: () => void;
  onNewBattle: () => void;
  onBackToMenu: () => void;
}

export const PostBattleResults = ({ onChallengeAgain, onNewBattle, onBackToMenu }: PostBattleResultsProps) => {
  const results = {
    totalChallenges: 4,
    successfulChallenges: 3,
    socraticPoints: 185,
    bestMoments: [
      { philosopher: "Nietzsche", challenge: "But aren't you making an objective claim about strength?", impact: "High" },
      { philosopher: "Socrates", challenge: "What do you mean by 'knowing nothing'?", impact: "Medium" },
    ],
    skillProgress: {
      questioning: 78,
      logic: 85,
      persistence: 92
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 relative overflow-hidden">
      {/* Celebration Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full blur-2xl animate-bounce" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-green-400 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 left-1/2 w-28 h-28 bg-purple-400 rounded-full blur-2xl animate-ping" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Victory Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-bounce">🏆</div>
          <h1 className="text-4xl font-bold text-white mb-4 font-serif">Battle Complete!</h1>
          <p className="text-xl text-yellow-400">Socrates would be proud of your questioning</p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Score Overview */}
          <Card className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <div className="text-4xl font-bold text-white mb-2">{results.socraticPoints}</div>
              <p className="text-yellow-400 font-semibold mb-4">Socratic Points Earned</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{results.successfulChallenges}/{results.totalChallenges}</div>
                  <p className="text-slate-300 text-sm">Successful Challenges</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">87%</div>
                  <p className="text-slate-300 text-sm">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Progress */}
          <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-yellow-400" />
                Socratic Skills
              </h3>
              
              <div className="space-y-4">
                {Object.entries(results.skillProgress).map(([skill, progress]) => (
                  <div key={skill}>
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300 capitalize">{skill}</span>
                      <span className="text-yellow-400">{progress}%</span>
                    </div>
                    <div className="bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-400 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Best Moments */}
        <Card className="bg-slate-800/40 border-slate-700 backdrop-blur-sm mb-8">
          <CardContent className="p-8">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-400" />
              Your Best Challenge Moments
            </h3>
            
            <div className="space-y-4">
              {results.bestMoments.map((moment, index) => (
                <div key={index} className="p-4 rounded-lg bg-slate-900/50 border border-slate-600">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-lg">{moment.philosopher === 'Nietzsche' ? '🔥' : '💭'}</div>
                      <span className="font-semibold text-white">{moment.philosopher}</span>
                    </div>
                    <Badge className={`${moment.impact === 'High' ? 'bg-red-600' : 'bg-yellow-600'} text-white`}>
                      {moment.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-slate-300 italic">"{moment.challenge}"</p>
                  <Button size="sm" variant="ghost" className="mt-2 text-yellow-400 hover:text-yellow-300">
                    🎬 Replay Moment
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Button 
            onClick={onChallengeAgain}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold px-8 py-3"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Challenge Again
          </Button>
          
          <Button 
            onClick={onNewBattle}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold px-8 py-3"
          >
            Try New Battle
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          
          <Button 
            onClick={onBackToMenu}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white font-semibold px-8 py-3"
          >
            Back to Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
