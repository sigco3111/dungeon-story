
import React from 'react';
import type { ChecklistItem as ChecklistItemType } from '../types';
import { CheckIcon, BoxIcon } from './Icons';

interface ChecklistProps {
  items: ChecklistItemType[];
}

const Checklist: React.FC<ChecklistProps> = ({ items }) => {

  const getIcon = (item: ChecklistItemType) => {
    if (item.completed) {
      return <CheckIcon className="w-5 h-5 text-green-400" />;
    }
    return <BoxIcon className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-2xl h-full">
      <h2 className="text-2xl font-bold mb-4 border-b border-slate-700 pb-2 text-violet-300">진행 목표</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="flex items-center">
            <div className="mr-4">
              {getIcon(item)}
            </div>
            <span
              className={`text-left transition-all duration-300 w-full ${
                item.completed
                  ? 'text-slate-500 line-through'
                  : 'text-slate-100'
              }`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checklist;
