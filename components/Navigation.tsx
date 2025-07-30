import React from 'react';
import { GameState } from '../types';
import { HomeIcon, DungeonIcon } from './Icons';

interface NavigationProps {
  gameState: GameState;
  onNavigateToTown: () => void;
  onNavigateToDungeon: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ gameState, onNavigateToTown, onNavigateToDungeon }) => {
  const isTownView = gameState === GameState.TOWN;
  const isExploringView = gameState === GameState.EXPLORING || gameState === GameState.IN_DUNGEON;
  
  const disableTownButton = isTownView;
  const disableDungeonButton = !isTownView;

  const townButtonClasses = `flex flex-col items-center justify-center gap-1 w-full py-2 rounded-lg transition-colors duration-200 ${
    isTownView ? 'bg-violet-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-700`;
  
  const dungeonButtonClasses = `flex flex-col items-center justify-center gap-1 w-full py-2 rounded-lg transition-colors duration-200 ${
    isExploringView ? 'bg-violet-600 text-white' : 'bg-red-700 hover:bg-red-600 text-white'
  } disabled:opacity-50 disabled:cursor-not-allowed`;

  // Don't show nav on certain screens
  if (gameState === GameState.GAME_OVER) {
    return null;
  }

  return (
    <nav className="w-full max-w-md mx-auto">
      <div className="flex justify-around items-center gap-2">
        <button 
          onClick={onNavigateToTown} 
          className={townButtonClasses} 
          disabled={disableTownButton} 
          aria-label="마을로 가기"
          aria-current={isTownView ? "page" : undefined}
        >
          <HomeIcon className="w-6 h-6" />
          <span className="text-xs font-bold">마을</span>
        </button>
        <button 
          onClick={onNavigateToDungeon} 
          className={dungeonButtonClasses} 
          disabled={disableDungeonButton} 
          aria-label="탐험하러 가기"
          aria-current={isExploringView ? "page" : undefined}
        >
          <DungeonIcon className="w-6 h-6" />
          <span className="text-xs font-bold">탐험</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;