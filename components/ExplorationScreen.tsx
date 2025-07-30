import React from 'react';
import type { Player, Dungeon, DungeonEvent, Resources, DungeonAffix } from '../types';
import PlayerStats from './PlayerStats';
import GameLog from './GameLog';
import { HomeIcon, MapIcon, CubeTransparentIcon, ExclamationTriangleIcon, TagIcon } from './Icons';

interface ExplorationScreenProps {
  player: Player;
  resources: Resources;
  log: string[];
  dungeonRun: { dungeon: Dungeon; affixes: DungeonAffix[]; currentEventId: string; currentFloor?: number; };
  event: DungeonEvent;
  onChoice: (nextEventId: string) => void;
  onReturnToTown: () => void;
}

const AffixTag: React.FC<{ affix: DungeonAffix }> = ({ affix }) => {
    const isNegative = affix.type === 'negative';
    const colorClasses = isNegative
        ? 'border-orange-500/50 bg-orange-900/20 text-orange-300'
        : 'border-sky-500/50 bg-sky-900/20 text-sky-300';
    const Icon = affix.icon;
    return (
        <div title={affix.description} className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs ${colorClasses} border`}>
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="font-semibold">{affix.name}</span>
        </div>
    );
};

const EventIcon: React.FC<{type: DungeonEvent['type']}> = ({ type }) => {
    const iconProps = { className: "w-16 h-16 text-slate-500 mb-4" };
    switch(type) {
        case 'choice': return <MapIcon {...iconProps} />;
        case 'treasure': return <CubeTransparentIcon {...iconProps} />;
        case 'trap': return <ExclamationTriangleIcon {...iconProps} />;
        default: return null;
    }
}

const ExplorationScreen: React.FC<ExplorationScreenProps> = ({ player, log, dungeonRun, event, onChoice, onReturnToTown }) => {
  const { dungeon, affixes, currentFloor } = dungeonRun;
  const isInfiniteRiftChoice = dungeon.id === 'infinite_rift' && event.type === 'choice';
  
  return (
    <div className="w-full max-w-lg flex flex-col gap-6 animate-fade-in">
        <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-violet-300 mb-2">{dungeon.name}</h2>
             {affixes.length > 0 && (
                <div className="mb-4 flex flex-wrap justify-center items-center gap-2">
                    <h4 className="font-bold text-slate-300 w-full mb-1 flex items-center justify-center gap-2"><TagIcon className="w-4 h-4"/>던전 특성</h4>
                    {affixes.map(affix => <AffixTag key={affix.id} affix={affix} />)}
                </div>
            )}
            
            <EventIcon type={event.type} />

            {isInfiniteRiftChoice ? (
                <div className="text-slate-300 mb-6 min-h-[48px]">
                    <p className="text-2xl font-bold text-violet-300 block mb-2">균열 {currentFloor}층 돌파!</p>
                    <p>{event.text}</p>
                </div>
            ) : (
                <p className="text-slate-300 mb-6 min-h-[48px]">{event.type !== 'monster' ? event.text : ''}</p>
            )}

            {event.type === 'choice' && (
                <div className="w-full flex flex-col gap-3">
                    {event.options.map(option => (
                        <button
                            key={option.nextEventId}
                            onClick={() => onChoice(option.nextEventId)}
                            className="w-full px-4 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            )}

            {event.type !== 'choice' && (
                 <div className="w-full flex flex-col items-center gap-3">
                    <p className="text-sm text-slate-400 animate-pulse">진행 중...</p>
                 </div>
            )}
        </div>

        <PlayerStats player={player} />
        <GameLog log={log} />

        <button
            onClick={onReturnToTown}
            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-md transition-all duration-200"
        >
            <HomeIcon className="w-6 h-6" />
            마을로 돌아가기
        </button>
    </div>
  );
};

export default ExplorationScreen;