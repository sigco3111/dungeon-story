
import React from 'react';

interface GameLogProps {
  log: string[];
}

const GameLog: React.FC<GameLogProps> = ({ log }) => {
  return (
    <div className="bg-slate-900/70 p-4 rounded-lg shadow-inner h-32 border border-slate-700" role="log">
        <h4 className="text-sm font-bold text-slate-400 mb-2">전투 기록</h4>
        <ul className="text-sm text-slate-300 space-y-1 overflow-y-auto h-full">
            {log.map((message, index) => (
                <li key={index} className="animate-fade-in-down">
                    {message}
                </li>
            ))}
        </ul>
        <style>{`
          .animate-fade-in-down {
            animation: fadeInDown 0.5s ease-out;
          }
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
    </div>
  );
};

export default GameLog;