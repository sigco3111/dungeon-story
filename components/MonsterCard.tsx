
import React from 'react';
import type { Monster } from '../types';
import { HeartIcon } from './Icons';

interface MonsterCardProps {
  monster: Monster;
}

const MonsterCard: React.FC<MonsterCardProps> = ({ monster }) => {
  const hpPercentage = (monster.hp / monster.maxHp) * 100;

  return (
    <div className="bg-slate-800 rounded-lg overflow-hidden shadow-2xl border border-slate-700">
      <img src={monster.image} alt={monster.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-slate-100">{monster.name}</h2>
          <div className="flex items-center text-red-400">
            <HeartIcon className="w-5 h-5 mr-1" />
            <span className="font-bold">{monster.hp} / {monster.maxHp}</span>
          </div>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-3">
          <div
            className="bg-red-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${hpPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MonsterCard;
