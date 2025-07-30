import React from 'react';
import type { Player } from '../types';
import { HeartIcon, ShieldIcon, BoltIcon } from './Icons';

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const hpPercentage = (player.hp / player.maxHp) * 100;
  const attackBuff = player.buffs?.attack || 0;
  const defenseBuff = player.buffs?.defense || 0;

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg shadow-lg border border-slate-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-slate-200">플레이어</h3>
        <div className="flex items-center gap-4">
           <div className="flex items-center text-orange-400">
              <BoltIcon className="w-5 h-5 mr-1" />
              <span className="font-bold">{player.attack}</span>
              {attackBuff > 0 && <span className="text-sm font-bold text-yellow-300 ml-1">(+{attackBuff})</span>}
          </div>
          {(player.defense > 0 || defenseBuff > 0) && (
             <div className="flex items-center text-sky-400">
                <ShieldIcon className="w-5 h-5 mr-1" />
                <span className="font-bold">{player.defense}</span>
                {defenseBuff > 0 && <span className="text-sm font-bold text-yellow-300 ml-1">(+{defenseBuff})</span>}
            </div>
          )}
          <div className="flex items-center text-green-400">
            <HeartIcon className="w-5 h-5 mr-1" />
            <span className="font-bold">{player.hp} / {player.maxHp}</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4">
        <div
          className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${hpPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PlayerStats;