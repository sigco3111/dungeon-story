import React from 'react';
import { PlayerAction } from '../types';
import { BoltIcon, ShieldIcon } from './Icons';

interface ActionBarProps {
  onPlayerAction: (action: PlayerAction) => void;
  disabled: boolean;
}

const ActionBar: React.FC<ActionBarProps> = ({ onPlayerAction, disabled }) => {
  return (
    <div className="bg-slate-800/50 p-3 rounded-lg shadow-lg border border-slate-700">
        <div className="flex justify-around items-center">
            <button
                onClick={() => onPlayerAction(PlayerAction.ATTACK)}
                disabled={disabled}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50"
            >
                <BoltIcon className="w-6 h-6" />
                공격
            </button>
            <div className="w-4"></div>
            <button
                onClick={() => onPlayerAction(PlayerAction.DEFEND)}
                disabled={disabled}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg disabled:bg-slate-600 disabled:cursor-not-allowed disabled:transform-none disabled:opacity-50"
            >
                <ShieldIcon className="w-6 h-6" />
                방어
            </button>
        </div>
    </div>
  );
};

export default ActionBar;