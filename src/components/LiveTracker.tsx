
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface LiveTrackerProps {
  socrates: {
    questions: number;
    gotcha: number;
  };
  nietzsche: {
    assertions: number;
    fallacies: number;
  };
  moderator: {
    questionsAsked: number;
    stumpedMoments: number;
  };
}

export const LiveTracker = ({ socrates, nietzsche, moderator }: LiveTrackerProps) => {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-center font-serif">📊 Live Debate Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Socrates Stats */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif">SOCRATES</h3>
              <Badge variant="secondary" className="text-xs">The Questioner</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">🔹 Logical Questions:</span>
                <span className="text-emerald-400 font-bold">{socrates.questions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">🔹 Gotcha Moments:</span>
                <span className="text-emerald-400 font-bold">{socrates.gotcha}</span>
              </div>
            </div>
          </div>

          {/* Moderator Stats */}
          <div className="p-4 bg-slate-600/20 border border-slate-500/30 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif">MODERATOR</h3>
              <Badge variant="secondary" className="text-xs">Debate Host</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">🎯 Questions Asked:</span>
                <span className="text-slate-400 font-bold">{moderator.questionsAsked}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">🎯 Stumped Moments:</span>
                <span className="text-slate-400 font-bold">{moderator.stumpedMoments}</span>
              </div>
            </div>
          </div>

          {/* Nietzsche Stats */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif">NIETZSCHE</h3>
              <Badge variant="secondary" className="text-xs">The Hammer</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">🔸 Assertions Made:</span>
                <span className="text-red-400 font-bold">{nietzsche.assertions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">🔸 Fallacies Detected:</span>
                <span className="text-red-400 font-bold">{nietzsche.fallacies}</span>
              </div>
            </div>
          </div>

          {/* Your Performance */}
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="text-center mb-3">
              <h3 className="font-bold text-white font-serif">YOUR SCORE</h3>
              <Badge className="bg-yellow-600 text-white">Socratic Challenger</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">⚡ Total Points:</span>
                <span className="text-yellow-400 font-bold">247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">🎯 Challenges Made:</span>
                <span className="text-yellow-400 font-bold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">🏆 Level:</span>
                <span className="text-yellow-400 font-bold">Novice</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
