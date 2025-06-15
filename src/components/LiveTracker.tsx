
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveTrackerProps {
  philosopher1: {
    name: string;
    color: string;
    points: number;
    actions: number;
  };
  philosopher2: {
    name: string;
    color: string;
    points: number;
    actions: number;
  };
  yourScore: {
    challenges: number;
    points: number;
  };
}

export const LiveTracker = ({ philosopher1, philosopher2, yourScore }: LiveTrackerProps) => {
  const getColorClasses = (color: string) => {
    const colorMap = {
      emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      red: "bg-red-500/10 border-red-500/30 text-red-400",
      blue: "bg-blue-500/10 border-blue-500/30 text-blue-400",
      purple: "bg-purple-500/10 border-purple-500/30 text-purple-400"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-slate-500/10 border-slate-500/30 text-slate-400";
  };

  return (
    <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-center font-serif text-lg">Live Debate Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Philosopher 1 */}
          <div className={`p-4 rounded-lg border ${getColorClasses(philosopher1.color)}`}>
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif text-sm">{philosopher1.name.toUpperCase()}</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Arguments:</span>
                <span className="font-bold">{philosopher1.actions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Strength:</span>
                <span className="font-bold">{philosopher1.points}</span>
              </div>
            </div>
          </div>

          {/* Your Score */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif text-sm">YOUR CHALLENGES</h3>
              <Badge className="bg-yellow-600 text-white text-xs">Socratic Method</Badge>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Questions Asked:</span>
                <span className="text-yellow-400 font-bold">{yourScore.challenges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Impact Points:</span>
                <span className="text-yellow-400 font-bold">{yourScore.points}</span>
              </div>
            </div>
          </div>

          {/* Philosopher 2 */}
          <div className={`p-4 rounded-lg border ${getColorClasses(philosopher2.color)}`}>
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif text-sm">{philosopher2.name.toUpperCase()}</h3>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-300">Arguments:</span>
                <span className="font-bold">{philosopher2.actions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Strength:</span>
                <span className="font-bold">{philosopher2.points}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
