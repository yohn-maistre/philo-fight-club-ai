
import { CircularParticipantCard } from "@/components/CircularParticipantCard";

interface CircularParticipantsProps {
  currentSpeaker: 'philosopher1' | 'philosopher2' | 'moderator' | 'user';
  debateConfig: any;
  philosopherExpressions: {[key: string]: string};
}

export const CircularParticipants = ({ currentSpeaker, debateConfig, philosopherExpressions }: CircularParticipantsProps) => {
  return (
    <div className="flex justify-center items-center space-x-8 md:space-x-12 lg:space-x-16">
      {/* Philosopher 1 */}
      {debateConfig.philosophers[0] && (
        <CircularParticipantCard
          name={debateConfig.philosophers[0].name}
          subtitle={debateConfig.philosophers[0].subtitle}
          color={debateConfig.philosophers[0].color}
          isActive={currentSpeaker === 'philosopher1'}
          expression={philosopherExpressions[debateConfig.philosophers[0].name]}
          size="lg"
        />
      )}

      {/* Moderator */}
      <CircularParticipantCard
        name={debateConfig.moderator.name}
        subtitle={debateConfig.moderator.subtitle}
        color="amber"
        isActive={currentSpeaker === 'moderator'}
        expression={philosopherExpressions[debateConfig.moderator.name]}
        size="md"
      />

      {/* Philosopher 2 */}
      {debateConfig.philosophers[1] && (
        <CircularParticipantCard
          name={debateConfig.philosophers[1].name}
          subtitle={debateConfig.philosophers[1].subtitle}
          color={debateConfig.philosophers[1].color}
          isActive={currentSpeaker === 'philosopher2'}
          expression={philosopherExpressions[debateConfig.philosophers[1].name]}
          size="lg"
        />
      )}
    </div>
  );
};
