import React from 'react';
import type { Player, Monster } from '../types';
import PlayerStats from './PlayerStats';
import MonsterCard from './MonsterCard';
import GameLog from './GameLog';

interface GameScreenProps {
  player: Player;
  monster: Monster;
  log: string[];
}

const GameScreen: React.FC<GameScreenProps> = ({ player, monster, log }) => {
  return (
    <div className="w-full max-w-lg flex flex-col gap-6 animate-fade-in">
      <MonsterCard monster={monster} />
      <PlayerStats player={player} />
      <GameLog log={log} />
    </div>
  );
};

export default GameScreen;