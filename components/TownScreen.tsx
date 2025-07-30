
import React, { useState, useEffect, useRef } from 'react';
import type { Resources, Building, CraftableItem, Player, Training, CraftablePotion, NPC, Quest, EquippedItem, TownEvent, Furniture } from '../types';
import { GoldIcon, WoodIcon, StoneIcon, HammerIcon, DungeonIcon, IronIcon, SwordIcon, ShieldIcon, HeartIcon, BedIcon, PlusCircleIcon, FlaskIcon, ArrowUpCircleIcon, BanknotesIcon, ExclamationCircleIcon, SparklesIcon, ShieldCheckIcon, WrenchScrewdriverIcon, ExclamationTriangleIcon, LockIcon, ArrowUpOnSquareIcon, ShoppingBagIcon, UserCircleIcon, BookOpenIcon, CubeTransparentIcon } from './Icons';
import { GRADE_CONFIG, REPUTATION_LEVELS, CRAFTABLE_POTIONS } from '../constants';

interface TownScreenProps {
  player: Player;
  resources: Resources;
  buildings: Building[];
  onBuild: (buildingId: string) => void;
  onEnterDungeon: () => void;
  craftableItems: CraftableItem[];
  onCraft: (itemId: string) => void;
  onEnchant: (type: 'weapon' | 'armor') => void;
  getEnchantInfo: (item: EquippedItem) => {
      cost: Resources;
      successRate: number;
      bonus: { attack: number; defense: number };
  };
  craftablePotions: CraftablePotion[];
  onCraftPotion: (potionId: CraftablePotion['id']) => void;
  trainingOptions: Training[];
  onTrain: (trainingId: 'attack' | 'defense' | 'maxHp') => void;
  calculateTrainingCost: (training: Training, level: number) => Resources;
  onRest: () => void;
  onExpandInn: () => void;
  calculateInnExpansionCost: (level: number) => Resources;
  onUpgradeBuilding: (buildingId: string) => void;
  calculateBuildingUpgradeCost: (building: Building) => Resources;
  onSellResource: (resource: 'wood' | 'stone' | 'iron', amount: number) => void;
  onBuyResource: (resource: 'wood' | 'stone' | 'iron', amount: number) => void;
  npcs: NPC[];
  quests: Quest[];
  onAcceptQuest: (questId: string) => void;
  onCompleteQuest: (questId: string) => void;
  raidCountdown: number;
  onRepairBuilding: (buildingId: string) => void;
  calculateRepairCost: (building: Building) => Resources;
  innBuilt: boolean;
  marketBuilt: boolean;
  lastBuildingEvent: { id: string; type: 'build' | 'upgrade' } | null;
  townEvent: TownEvent | null;
  onBuyFromMerchant: (itemIndex: number) => void;
  furniture: Furniture[];
  onPlaceFurniture: (furnitureId: string) => void;
  highestFloorReached: number;
  proficiencyExpToLevelUp: (level: number) => number;
  worldBoss: { isActive: boolean; currentHp: number; timeRemaining: number } | null;
}

const ResourceItem: React.FC<{ icon: React.ReactNode, value: number, name: string, animationClass?: string }> = ({ icon, value, name, animationClass }) => (
  <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-md">
    {icon}
    <span className={`font-bold text-lg transition-colors duration-300 ${animationClass}`}>{value}</span>
    <span className="text-sm text-slate-400">{name}</span>
  </div>
);

const EquipmentPanel: React.FC<{equipment: Player['equipment'], highestFloorReached: number}> = ({ equipment, highestFloorReached }) => {
    const renderItem = (item: EquippedItem | null) => {
        if (!item) return <span className="text-slate-500">없음</span>;
        const gradeInfo = GRADE_CONFIG[item.grade];
        const stats = item.stats;
        const statString = [
            stats.attack > 0 ? `공격 +${stats.attack}` : '',
            stats.defense > 0 ? `방어 +${stats.defense}` : '',
            stats.maxHp > 0 ? `체력 +${stats.maxHp}` : '',
        ].filter(Boolean).join(' / ');
        const enchantStr = item.enchantLevel > 0 ? ` +${item.enchantLevel}` : '';

        return (
            <div className="flex flex-col">
                <span className={`font-bold ${gradeInfo.color}`}>{`[${gradeInfo.name}] ${item.name}`}<span className="text-amber-300">{enchantStr}</span></span>
                <span className="text-xs text-slate-400">{statString}</span>
            </div>
        );
    };

    return (
        <div>
            <h2 id="equipment-heading" className="text-2xl font-bold mb-4 text-violet-300">장비 및 기록</h2>
            <div className="bg-slate-800/70 p-4 rounded-lg shadow-lg border border-slate-700 space-y-3" role="group" aria-labelledby="equipment-heading">
                <div className="flex items-center gap-4">
                    <div className="w-16 flex-shrink-0"><span className="font-semibold text-slate-300 flex items-center gap-2"><SwordIcon className="w-5 h-5"/>무기</span></div>
                    {renderItem(equipment.weapon)}
                </div>
                 <div className="border-t border-slate-700/50"></div>
                <div className="flex items-center gap-4">
                    <div className="w-16 flex-shrink-0"><span className="font-semibold text-slate-300 flex items-center gap-2"><ShieldIcon className="w-5 h-5"/>방어구</span></div>
                    {renderItem(equipment.armor)}
                </div>
                <div className="border-t border-slate-700/50"></div>
                <div className="flex items-center gap-4">
                    <div className="w-16 flex-shrink-0"><span className="font-semibold text-slate-300 flex items-center gap-2"><DungeonIcon className="w-5 h-5 text-violet-400"/>균열</span></div>
                    <span className="text-slate-300">최고 기록: <span className="font-bold text-violet-300">{highestFloorReached > 0 ? `${highestFloorReached}층` : '미도전'}</span></span>
                </div>
            </div>
        </div>
    );
};

const CostDisplay: React.FC<{ cost: Resources, prefix?: string }> = ({ cost, prefix }) => (
    <div className="text-xs text-slate-300 flex justify-start items-center flex-wrap gap-x-3 gap-y-1 mt-2 border-t border-slate-700/50 pt-2">
      {prefix && <span className="font-semibold text-slate-400">{prefix}</span>}
      {cost.gold > 0 && <span className="flex items-center"><GoldIcon className="w-3 h-3 inline mr-1 text-yellow-400" />{cost.gold}</span>}
      {cost.wood > 0 && <span className="flex items-center"><WoodIcon className="w-3 h-3 inline mr-1 text-amber-600" />{cost.wood}</span>}
      {cost.stone > 0 && <span className="flex items-center"><StoneIcon className="w-3 h-3 inline mr-1 text-slate-500" />{cost.stone}</span>}
      {cost.iron > 0 && <span className="flex items-center"><IronIcon className="w-3 h-3 inline mr-1 text-gray-400" />{cost.iron}</span>}
      {cost.ancientShard > 0 && <span className="flex items-center"><CubeTransparentIcon className="w-3 h-3 inline mr-1 text-fuchsia-400" />{cost.ancientShard}</span>}
    </div>
);

const QuestCard: React.FC<{ quest: Quest; npc: NPC; onAcceptQuest: (questId: string) => void; onCompleteQuest: (questId: string) => void; canAfford: (cost: Resources) => boolean; isLocked: boolean; npcs: NPC[] }> = ({ quest, npc, onAcceptQuest, onCompleteQuest, canAfford, isLocked, npcs }) => {
    const requirementsMet = canAfford(quest.requirements.cost);
    const borderColor = quest.isStoryQuest ? 'border-yellow-400/80' : 'border-yellow-600/60';
    const textColor = quest.isStoryQuest ? 'text-yellow-200' : 'text-yellow-300';
    
    if (isLocked) {
        const repReq = quest.requiredReputation;
        if (!repReq) return null; // Should not happen if isLocked is true
        const repNpc = npcs.find(n => n.id === repReq.npcId);
        const repLevelReq = REPUTATION_LEVELS[repReq.level];

        return (
             <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700 mt-2">
                 <p className="font-semibold text-slate-500 flex items-center gap-2">
                     <LockIcon className="w-4 h-4"/>
                     <span>{quest.isStoryQuest ? "메인 퀘스트" : `${npc.name}의 퀘스트`}: {quest.title}</span>
                 </p>
                 <p className="text-xs text-slate-500 mt-1">{quest.description}</p>
                 <div className="text-xs text-red-400 mt-2 border-t border-slate-700/50 pt-2 text-center font-semibold">
                     {`${repNpc?.name || 'NPC'} 평판 [${repLevelReq?.name || '등급'}] 필요`}
                 </div>
             </div>
        );
    }

    return (
      <div className={`bg-slate-900/50 p-3 rounded-md border ${borderColor} mt-2`}>
        <p className={`font-semibold ${textColor} flex items-center gap-2`}>
            <ExclamationCircleIcon className="w-4 h-4"/>
            <span>{quest.isStoryQuest ? "메인 퀘스트" : `${npc.name}의 퀘스트`}: {quest.title}</span>
        </p>
        <p className="text-xs text-slate-400 mt-1">{quest.description}</p>
        <CostDisplay cost={quest.requirements.cost} prefix="필요 자원:" />
        {quest.rewards.resources && <CostDisplay cost={quest.rewards.resources} prefix="보상:" />}
        
        {quest.status === 'available' && (
          <button onClick={() => onAcceptQuest(quest.id)} className="w-full mt-2 text-sm px-3 py-1.5 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-md transition-all duration-200">
            수락
          </button>
        )}
        {quest.status === 'in_progress' && (
          <button onClick={() => onCompleteQuest(quest.id)} disabled={!requirementsMet} className="w-full mt-2 text-sm px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed">
            {requirementsMet ? '완료' : '재료 부족'}
          </button>
        )}
      </div>
    );
};


const TownScreen: React.FC<TownScreenProps> = (props) => {
  const { player, resources, buildings, onBuild, onEnterDungeon, craftableItems, onCraft, onEnchant, getEnchantInfo, craftablePotions, onCraftPotion, trainingOptions, onTrain, calculateTrainingCost, onRest, onExpandInn, calculateInnExpansionCost, onUpgradeBuilding, calculateBuildingUpgradeCost, onSellResource, onBuyResource, npcs, quests, onAcceptQuest, onCompleteQuest, raidCountdown, onRepairBuilding, calculateRepairCost, innBuilt, marketBuilt, lastBuildingEvent, townEvent, onBuyFromMerchant, furniture, onPlaceFurniture, highestFloorReached, proficiencyExpToLevelUp, worldBoss } = props;
  const [marketTab, setMarketTab] = useState<'sell' | 'buy'>('sell');
  const [blacksmithTab, setBlacksmithTab] = useState<'craft' | 'enchant'>('craft');
  const [sellAmount, setSellAmount] = useState(10);
  const [buyAmount, setBuyAmount] = useState(10);
  const [announcement, setAnnouncement] = useState('');

  const [resourceAnimations, setResourceAnimations] = useState<Record<keyof Resources, string>>({ gold: '', wood: '', stone: '', iron: '', ancientShard: '' });
  const prevResourcesRef = useRef<Resources | null>(null);

  const getReputationLevelInfo = (points: number) => {
    let currentLevel = REPUTATION_LEVELS[0];
    let levelIndex = 0;
    for (let i = REPUTATION_LEVELS.length - 1; i >= 0; i--) {
        if (points >= REPUTATION_LEVELS[i].points) {
            currentLevel = REPUTATION_LEVELS[i];
            levelIndex = i;
            break;
        }
    }
    const nextLevel = REPUTATION_LEVELS[levelIndex + 1];
    const pointsInLevel = points - currentLevel.points;
    const pointsForNextLevel = nextLevel ? nextLevel.points - currentLevel.points : 0;
    const percentage = pointsForNextLevel > 0 ? Math.floor((pointsInLevel / pointsForNextLevel) * 100) : 100;

    return { ...currentLevel, level: levelIndex, nextLevel, pointsInLevel, pointsForNextLevel, percentage };
  };

  const ReputationDisplay: React.FC<{npc: NPC}> = ({ npc }) => {
      const repPoints = player.npcReputation[npc.id] || 0;
      const repInfo = getReputationLevelInfo(repPoints);

      return (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
              <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-semibold text-slate-300">평판: <span className={repInfo.color}>{repInfo.name}</span></span>
                  {repInfo.nextLevel && (
                      <span className="text-slate-400">{repInfo.pointsInLevel} / {repInfo.pointsForNextLevel}</span>
                  )}
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2.5">
                  <div className={`${repInfo.color.replace('text-','bg-')} h-2.5 rounded-full`} style={{width: `${repInfo.percentage}%`}}></div>
              </div>
          </div>
      );
  }

  const ProficiencyDisplay: React.FC<{
      type: 'blacksmithing' | 'alchemy';
  }> = ({ type }) => {
      const profData = player.proficiency[type];
      const expToLevelUp = proficiencyExpToLevelUp(profData.level);
      const percentage = expToLevelUp > 0 ? Math.floor((profData.exp / expToLevelUp) * 100) : 100;
      const name = type === 'blacksmithing' ? '대장 기술' : '연금술';
      
      return (
          <div className="mt-2 pt-2 border-t border-slate-700/50">
              <div className="flex justify-between items-center text-sm mb-1">
                  <span className="font-semibold text-slate-300 flex items-center gap-2">
                      <BookOpenIcon className="w-4 h-4 text-amber-300" />
                      {name} 숙련도: <span className="text-amber-200">Lv.{profData.level}</span>
                  </span>
                  <span className="text-slate-400">{profData.exp} / {expToLevelUp} XP</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2.5">
                  <div className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
              </div>
          </div>
      );
  };

  useEffect(() => {
    if (prevResourcesRef.current) {
        const newAnimations: Record<keyof Resources, string> = { gold: '', wood: '', stone: '', iron: '', ancientShard: '' };
        let changed = false;

        (Object.keys(resources) as Array<keyof Resources>).forEach(key => {
            if (resources[key] > prevResourcesRef.current![key]) {
                newAnimations[key] = 'animate-gain';
                changed = true;
            } else if (resources[key] < prevResourcesRef.current![key]) {
                newAnimations[key] = 'animate-loss';
                changed = true;
            }
        });

        if (changed) {
            setResourceAnimations(newAnimations);
            const timer = setTimeout(() => {
                setResourceAnimations({ gold: '', wood: '', stone: '', iron: '', ancientShard: '' });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }
  }, [resources]);

    useEffect(() => {
        if (lastBuildingEvent) {
            const building = buildings.find(b => b.id === lastBuildingEvent.id);
            if (building) {
                const message = lastBuildingEvent.type === 'build'
                    ? `${building.name} 건설이 완료되었습니다.`
                    : `${building.name}이(가) 레벨 ${building.level}(으)로 업그레이드되었습니다.`;
                setAnnouncement(message);
            }
        }
    }, [lastBuildingEvent, buildings]);

  useEffect(() => {
    prevResourcesRef.current = resources;
  }, [resources]);

  const canAfford = (cost: Partial<Resources>) => {
    return resources.gold >= (cost.gold || 0) && resources.wood >= (cost.wood || 0) && resources.stone >= (cost.stone || 0) && resources.iron >= (cost.iron || 0) && resources.ancientShard >= (cost.ancientShard || 0);
  };
  
  const townNpcs = npcs.filter(npc => !npc.buildingId);
  
  const townDefense = buildings.reduce((acc, b) => {
    if (!b.built || b.damaged) return acc;
    const buildingDefense = b.defense || 0;
    const levelBonus = (b.level - 1) * (buildingDefense * 0.5);
    return acc + buildingDefense + levelBonus;
  }, 0);
  
  const resourceNameMap: Record<string, string> = { wood: '목재', stone: '석재', iron: '철광석' };
  const potionInfoMap: Record<string, {name: string, description: string}> = {};
  CRAFTABLE_POTIONS.forEach(p => { potionInfoMap[p.id] = { name: p.name, description: p.description } });

  const EnchantSlot: React.FC<{
      type: 'weapon' | 'armor';
      item: EquippedItem | null;
  }> = ({ type, item }) => {
      const Icon = type === 'weapon' ? SwordIcon : ShieldIcon;
      const typeName = type === 'weapon' ? '무기' : '방어구';

      if (!item) {
          return (
              <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700 text-center text-slate-500">
                  {typeName}를 장착해주세요.
              </div>
          );
      }
      
      const { cost, successRate, bonus } = getEnchantInfo(item);
      const gradeInfo = GRADE_CONFIG[item.grade];

      return (
          <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
              <div className="flex justify-between items-start gap-2">
                  <div className="flex-grow">
                      <p className={`font-bold ${gradeInfo.color} flex items-center gap-2`}>
                          <Icon className="w-5 h-5" />
                          <span>{`[${gradeInfo.name}] ${item.name}`} <span className="text-amber-300">{item.enchantLevel > 0 ? `+${item.enchantLevel}` : ''}</span></span>
                      </p>
                      <div className="text-xs text-slate-300 mt-2 space-y-1">
                          <p>성공 확률: <span className="font-semibold text-sky-300">{(successRate * 100).toFixed(0)}%</span></p>
                          <p>성공 시: <span className="font-semibold text-green-400">{bonus.attack > 0 ? `공격력 +${bonus.attack}` : `방어력 +${bonus.defense}`}</span></p>
                           {item.enchantLevel > 0 && (
                            <p className="text-amber-400">실패 시: <span className="font-semibold">강화 단계 하락!</span></p>
                          )}
                      </div>
                  </div>
                  <button
                      onClick={() => onEnchant(type)}
                      disabled={!canAfford(cost)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed flex-shrink-0 flex items-center gap-2"
                  >
                     <ArrowUpOnSquareIcon className="w-5 h-5" /> 강화
                  </button>
              </div>
              <CostDisplay cost={cost} prefix="비용:" />
          </div>
      );
  };

  return (
    <div className="w-full max-w-4xl flex flex-col gap-6 animate-fade-in p-4 sm:p-0">
      <div className="sr-only" aria-live="assertive">{announcement}</div>
      <style>{`
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
          }
          .animate-gain { animation: gain-anim 1s ease-out; }
          .animate-loss { animation: loss-anim 1s ease-out; }
          @keyframes gain-anim {
              0% { color: #4ade80; transform: scale(1.1); }
              100% { color: inherit; transform: scale(1); }
          }
          @keyframes loss-anim {
              0% { color: #f87171; transform: scale(0.9); }
              100% { color: inherit; transform: scale(1); }
          }
          .animate-ping-once {
              animation: ping 1s cubic-bezier(0, 0, 0.2, 1);
          }
          .animate-fade-out-fast {
              animation: fadeOut 2s ease-out forwards;
          }
          @keyframes fadeOut {
              0% { opacity: 1; transform: translateY(0); }
              80% { opacity: 1; transform: translateY(-5px); }
              100% { opacity: 0; transform: translateY(-10px); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100">마을</h2>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-2 text-sky-300">
              <ShieldCheckIcon className="w-5 h-5" />
              <span className="font-semibold">마을 방어력: {townDefense}</span>
            </div>
          </div>
        </div>
        <div className="text-center">
            <p className="text-sm text-yellow-400 mt-2 animate-pulse">다음 습격까지: {raidCountdown}회 탐험</p>
        </div>
      </div>
      
      {/* Resources Display */}
      <div role="group" aria-label="Player Resources" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <ResourceItem icon={<GoldIcon className="w-6 h-6 text-yellow-400" />} value={resources.gold} name="골드" animationClass={resourceAnimations.gold} />
        <ResourceItem icon={<WoodIcon className="w-6 h-6 text-amber-600" />} value={resources.wood} name="목재" animationClass={resourceAnimations.wood} />
        <ResourceItem icon={<StoneIcon className="w-6 h-6 text-slate-500" />} value={resources.stone} name="석재" animationClass={resourceAnimations.stone} />
        <ResourceItem icon={<IronIcon className="w-6 h-6 text-gray-400" />} value={resources.iron} name="철광석" animationClass={resourceAnimations.iron} />
        {resources.ancientShard > 0 && <ResourceItem icon={<CubeTransparentIcon className="w-6 h-6 text-fuchsia-400" />} value={resources.ancientShard} name="파편" animationClass={resourceAnimations.ancientShard} />}
      </div>
      
      {/* World Boss Banner */}
      {worldBoss?.isActive && (
        <div className="p-4 rounded-lg border-2 border-red-500 bg-red-900/50 shadow-2xl animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ExclamationTriangleIcon className="w-12 h-12 text-red-300 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-red-200">[월드 보스] 고대의 거상이 나타났습니다!</h3>
              <p className="text-red-300">남은 시간: {worldBoss.timeRemaining}회 탐험</p>
            </div>
          </div>
          <button onClick={onEnterDungeon} className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg shadow-lg w-full sm:w-auto">
            도전하기
          </button>
        </div>
      )}

      {/* Town Event Card */}
      {townEvent && (
          <div className="bg-teal-900/40 p-4 rounded-lg shadow-lg border border-teal-500/50 space-y-3 animate-fade-in">
              <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-teal-200 flex items-center gap-3">
                      <ShoppingBagIcon className="w-6 h-6" />
                      {townEvent.name}
                  </h2>
                  <span className="text-sm font-semibold text-teal-300">남은 기간: {townEvent.duration}회 탐험</span>
              </div>
              <p className="text-sm text-slate-300">{townEvent.description}</p>
              <div className="space-y-2 pt-2 border-t border-teal-700/50">
                  {townEvent.items.map((item, index) => {
                      const name = item.type === 'resource'
                          ? `${resourceNameMap[item.id]} x${item.amount}`
                          : potionInfoMap[item.id].name;
                      
                      const isSoldOut = item.stock <= 0;
                      const cannotAfford = !canAfford(item.cost);

                      return (
                          <div key={index} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                              <div className="flex justify-between items-center gap-2">
                                  <div>
                                      <p className="font-semibold text-slate-100">{name} <span className="text-slate-400 font-normal">(재고: {item.stock})</span></p>
                                  </div>
                                  <button
                                      onClick={() => onBuyFromMerchant(index)}
                                      disabled={isSoldOut || cannotAfford}
                                      className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-sm font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0"
                                  >
                                      {isSoldOut ? '품절' : '구매'}
                                  </button>
                              </div>
                              <CostDisplay cost={item.cost} prefix="가격:" />
                          </div>
                      );
                  })}
              </div>
          </div>
      )}

      <EquipmentPanel equipment={player.equipment} highestFloorReached={highestFloorReached} />

      {/* Village Center Section */}
      {townNpcs.length > 0 && (
        <div>
            <h2 id="village-center-heading" className="text-2xl font-bold mb-4 text-violet-300">마을 중심</h2>
            <div className="space-y-4" role="group" aria-labelledby="village-center-heading">
            {townNpcs.map(npc => {
                const allNpcQuests = quests.filter(q => q.npcId === npc.id && q.status !== 'completed');
                const sortedQuests = [...allNpcQuests].sort((a,b) => a.id.localeCompare(b.id));
                let nextQuest = sortedQuests.find(q => q.status === 'in_progress');
                if (!nextQuest) {
                    nextQuest = sortedQuests.find(q => q.status === 'available');
                }

                return(
                    <div key={npc.id} className="bg-slate-800/70 p-4 rounded-lg shadow-lg border border-slate-700">
                        <h3 className="text-xl font-bold text-slate-100">{npc.name}</h3>
                        <p className="text-slate-400 text-sm mt-1">{npc.description}</p>
                        {nextQuest && (
                           <QuestCard
                             quest={nextQuest}
                             npc={npc}
                             onAcceptQuest={onAcceptQuest}
                             onCompleteQuest={onCompleteQuest}
                             canAfford={canAfford}
                             isLocked={
                                nextQuest.requiredReputation ?
                                getReputationLevelInfo(player.npcReputation[nextQuest.requiredReputation.npcId] || 0).level < nextQuest.requiredReputation.level
                                : false
                             }
                             npcs={npcs}
                           />
                        )}
                    </div>
                );
            })}
            </div>
        </div>
      )}


      {/* Buildings Section */}
      <div>
        <h2 id="buildings-heading" className="text-2xl font-bold mt-6 mb-4 text-violet-300">건물</h2>
        <div className="space-y-4" role="group" aria-labelledby="buildings-heading">
          {buildings.map(building => {
            const upgradeCost = calculateBuildingUpgradeCost(building);
            const repairCost = calculateRepairCost(building);
            const buildingNpc = npcs.find(npc => npc.buildingId === building.id);
            const isMaxLevel = building.built && building.maxLevel && building.level >= building.maxLevel;
            
            const allNpcQuests = buildingNpc 
                ? quests.filter(q => q.npcId === buildingNpc.id && q.status !== 'completed') 
                : [];

            const sortedQuests = [...allNpcQuests].sort((a,b) => a.id.localeCompare(b.id));
            let nextQuest = sortedQuests.find(q => q.status === 'in_progress');
            if (!nextQuest) {
                nextQuest = sortedQuests.find(q => q.status === 'available');
            }

            const hasAvailableQuest = allNpcQuests.some(q => {
                if (q.status !== 'available') return false;
                if (!q.requiredReputation) return true;
                const currentRepLevel = getReputationLevelInfo(player.npcReputation[q.requiredReputation.npcId] || 0).level;
                return currentRepLevel >= q.requiredReputation.level;
            });

            const upgradeCard = (
                <div className="bg-slate-900/50 p-3 rounded-md border border-violet-800/60 mt-2">
                    <div className="flex justify-between items-center gap-2">
                        <div>
                            <p className="font-semibold text-slate-100 flex items-center gap-2"><ArrowUpCircleIcon className="w-4 h-4 text-violet-300"/>건물 업그레이드</p>
                        </div>
                        <button
                            onClick={() => onUpgradeBuilding(building.id)}
                            disabled={!canAfford(upgradeCost) || isMaxLevel}
                            className="px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white text-sm font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0"
                        >
                            {isMaxLevel ? '최고 레벨' : '업그레이드'}
                        </button>
                    </div>
                    {!isMaxLevel && <CostDisplay cost={upgradeCost} prefix="비용:" />}
                </div>
            );
            
            return (
            <div key={building.id} className={`relative p-4 rounded-lg shadow-lg border transition-colors ${building.damaged ? 'bg-red-900/40 border-red-700/50' : 'bg-slate-800/70 border-slate-700'} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 overflow-hidden`}>
              {lastBuildingEvent && lastBuildingEvent.id === building.id && (
                  <>
                      <div className="absolute inset-0 bg-green-500/20 rounded-lg animate-ping-once pointer-events-none"></div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-fade-out-fast z-10">
                          {lastBuildingEvent.type === 'build' ? '건설 완료!' : '업그레이드!'}
                      </div>
                  </>
              )}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    {building.id === 'house' ? <UserCircleIcon className="w-6 h-6" /> : null}
                    {building.name} {building.built && <span className={`text-lg font-semibold ${building.damaged ? 'text-red-400' : isMaxLevel ? 'text-yellow-400' : 'text-violet-300'}`}>{building.damaged ? '(파손됨)' : isMaxLevel ? '(MAX)' : `(Lv.${building.level})`}</span>}
                    {building.built && !building.damaged && hasAvailableQuest && <span title="새 퀘스트 있음"><ExclamationCircleIcon className="w-5 h-5 text-yellow-300 animate-pulse" /></span>}
                </h3>
                <p className="text-slate-400 text-sm mt-1">{building.description}</p>
                {building.built && !building.damaged && buildingNpc && <ReputationDisplay npc={buildingNpc} />}
              </div>
              
              <div className="w-full sm:w-auto flex-shrink-0 sm:max-w-xs lg:max-w-sm">
                {building.built ? (
                  building.damaged ? (
                    <div className="flex flex-col items-stretch gap-2">
                       <p className="text-center text-sm text-red-300">건물이 파손되어 사용할 수 없습니다. 수리가 필요합니다.</p>
                       <CostDisplay cost={repairCost} prefix="수리 비용:" />
                       <button
                         onClick={() => onRepairBuilding(building.id)}
                         disabled={!canAfford(repairCost)}
                         className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                       >
                         <WrenchScrewdriverIcon className="w-5 h-5" />
                         수리하기
                       </button>
                    </div>
                  ) : (
                  (() => {
                    if (building.id === 'house') {
                        return (
                          <div className="flex flex-col gap-2 w-full">
                            <h4 className="font-bold text-lg text-slate-200 mb-1">가구 배치</h4>
                            {furniture.map(item => {
                                const cannotAfford = !canAfford(item.cost);
                                let buttonText = "배치하기";
                                if (item.isPlaced) buttonText = "배치 완료";
                                else if (cannotAfford) buttonText = "재료 부족";

                                return (
                                    <div key={item.id} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                                        <div className="flex justify-between items-center gap-2">
                                            <div>
                                                <p className="font-semibold text-slate-100">{item.name}</p>
                                                <p className="text-xs text-slate-400">{item.description}</p>
                                            </div>
                                            <button
                                                onClick={() => onPlaceFurniture(item.id)}
                                                disabled={item.isPlaced || cannotAfford}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0 flex items-center gap-1.5"
                                            >
                                                <PlusCircleIcon className="w-5 h-5" />
                                                {buttonText}
                                            </button>
                                        </div>
                                        {!item.isPlaced && <CostDisplay cost={item.cost} prefix="재료:" />}
                                    </div>
                                );
                            })}
                          </div>
                        );
                    }
                    if (building.id === 'blacksmith') {
                      return (
                        <div className="flex flex-col gap-2 w-full">
                          <div role="tablist" aria-label="대장간 기능" className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/50">
                            <button id="craft-tab" role="tab" aria-selected={blacksmithTab === 'craft'} aria-controls="blacksmith-panel" onClick={() => setBlacksmithTab('craft')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${blacksmithTab === 'craft' ? 'bg-violet-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700/50'}`}>제작</button>
                            <button id="enchant-tab" role="tab" aria-selected={blacksmithTab === 'enchant'} aria-controls="blacksmith-panel" onClick={() => setBlacksmithTab('enchant')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${blacksmithTab === 'enchant' ? 'bg-amber-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700/50'}`}>강화</button>
                          </div>
                          
                          <div id="blacksmith-panel" role="tabpanel" aria-labelledby={blacksmithTab === 'craft' ? 'craft-tab' : 'enchant-tab'}>
                              {blacksmithTab === 'craft' ? (
                                <div className="space-y-2 animate-fade-in">
                                  {craftableItems.length > 0 ? craftableItems.map(item => {
                                      const req = item.requiredReputation;
                                      const repInfo = req ? getReputationLevelInfo(player.npcReputation[req.npcId] || 0) : null;
                                      const isRepLocked = req && (!repInfo || repInfo.level < req.level);
                                      const repNpc = isRepLocked ? npcs.find(n => n.id === req.npcId) : null;
                                      const repLevelReq = isRepLocked ? REPUTATION_LEVELS[req.level] : null;

                                      return (
                                      <div key={item.id} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                                          <div className="flex justify-between items-center gap-2">
                                              <div>
                                                  <p className="font-semibold text-slate-100 flex items-center gap-1">{isRepLocked && <LockIcon className="w-4 h-4 text-slate-500" />}{item.name} {item.requiredBuildingLevel > 1 && item.requiredBuildingLevel === building.level && <span className="text-xs font-normal text-violet-400">신규!</span>}</p>
                                                  <p className="text-xs text-slate-400">
                                                      {item.description}
                                                  </p>
                                              </div>
                                              <button
                                                  onClick={() => onCraft(item.id)}
                                                  disabled={!canAfford(item.cost) || isRepLocked}
                                                  className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0"
                                              >
                                                  제작
                                              </button>
                                          </div>
                                          <CostDisplay cost={item.cost} prefix="재료:" />
                                          {isRepLocked && repNpc && repLevelReq && (
                                              <p className="text-xs text-red-400 mt-1 text-right">{`${repNpc.name} 평판 [${repLevelReq.name}] 필요`}</p>
                                          )}
                                      </div>
                                      )
                                  }) : <p className="text-sm text-center text-slate-400">제작 가능한 아이템이 없습니다.</p>}
                                </div>
                              ) : (
                                <div className="space-y-4 animate-fade-in">
                                  <EnchantSlot type="weapon" item={player.equipment.weapon} />
                                  <EnchantSlot type="armor" item={player.equipment.armor} />
                                </div>
                              )}
                          </div>
                          <ProficiencyDisplay type="blacksmithing" />
                           {nextQuest && buildingNpc && <QuestCard
                                quest={nextQuest}
                                npc={buildingNpc}
                                onAcceptQuest={onAcceptQuest}
                                onCompleteQuest={onCompleteQuest}
                                canAfford={canAfford}
                                isLocked={
                                    nextQuest.requiredReputation ?
                                    getReputationLevelInfo(player.npcReputation[nextQuest.requiredReputation.npcId] || 0).level < nextQuest.requiredReputation.level
                                    : false
                                }
                                npcs={npcs}
                             />}
                           {upgradeCard}
                        </div>
                      );
                    }
                    if (building.id === 'training_ground') {
                      return (
                        <div className="flex flex-col gap-2 w-full">
                          {trainingOptions.map(option => {
                            const level = player.trainingLevels[option.id];
                            const cost = calculateTrainingCost(option, level);
                            const Icon = { attack: SwordIcon, defense: ShieldIcon, maxHp: HeartIcon }[option.id];

                            return (
                                <div key={option.id} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                                    <div className="flex justify-between items-center gap-2">
                                        <div>
                                            <p className="font-semibold text-slate-100 flex items-center gap-2">
                                              <Icon className="w-4 h-4 text-violet-300"/>
                                              <span>{option.name} <span className="text-slate-400 font-normal">(Lv.{level})</span></span>
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">{option.description}</p>
                                        </div>
                                        <button
                                            onClick={() => onTrain(option.id)}
                                            disabled={!canAfford(cost)}
                                            className="px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0"
                                        >
                                            훈련
                                        </button>
                                    </div>
                                    <CostDisplay cost={cost} prefix="비용:" />
                                </div>
                            );
                          })}
                          {upgradeCard}
                        </div>
                      );
                    }
                     if (building.id === 'inn') {
                      if (!innBuilt) return null;
                      const expansionLevel = player.trainingLevels.inn;
                      const expansionCost = calculateInnExpansionCost(expansionLevel);
                      const restCost = { gold: 15, wood: 0, stone: 0, iron: 0, ancientShard: 0 };
                      const hasRested = player.buffs !== null;

                      return (
                        <div className="flex flex-col gap-2 w-full">
                           <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <div className="flex-1 bg-slate-900/50 p-3 rounded-md border border-slate-700 flex flex-col justify-between">
                                <div>
                                  <p className="font-semibold text-slate-100 flex items-center gap-2"><BedIcon className="w-5 h-5 text-sky-300" />휴식하기</p>
                                  <p className="text-xs text-slate-400 mt-1">다음 던전에서 공/방 +{5 + (building.level - 1) * 2} 버프를 받습니다.</p>
                                </div>
                                <div className="flex flex-col items-stretch gap-2 mt-2">
                                  <CostDisplay cost={restCost} prefix="비용:" />
                                  <button onClick={onRest} disabled={hasRested || !canAfford(restCost)} className="w-full mt-auto text-sm px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70">
                                    {hasRested ? '휴식 완료' : '휴식'}
                                  </button>
                                </div>
                              </div>
                              <div className="flex-1 bg-slate-900/50 p-3 rounded-md border border-slate-700 flex flex-col justify-between">
                                <div>
                                  <p className="font-semibold text-slate-100 flex items-center gap-2"><PlusCircleIcon className="w-5 h-5 text-emerald-300" />객실 증축 <span className="text-slate-400 font-normal">(Lv.{expansionLevel})</span></p>
                                  <p className="text-xs text-slate-400 mt-1">최대 체력이 영구적으로 10 상승합니다.</p>
                                </div>
                                <div className="flex flex-col items-stretch gap-2 mt-2">
                                    <CostDisplay cost={expansionCost} prefix="비용:" />
                                    <button onClick={onExpandInn} disabled={!canAfford(expansionCost)} className="w-full mt-auto text-sm px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70">
                                        증축
                                    </button>
                                </div>
                              </div>
                           </div>
                           {upgradeCard}
                        </div>
                      );
                    }
                    if (building.id === 'alchemy_lab') {
                      return (
                        <div className="flex flex-col gap-2 w-full">
                          {craftablePotions.map(potion => {
                            const cannotAfford = !canAfford(potion.cost);
                            const isMaxQuantity = player.potions[potion.id] >= potion.maxQuantity;
                            let buttonText = "제작";
                            if (isMaxQuantity) buttonText = "최대 소지";
                            else if (cannotAfford) buttonText = "재료 부족";

                            return (
                                <div key={potion.id} className="bg-slate-900/50 p-3 rounded-md border border-slate-700">
                                    <div className="flex justify-between items-center gap-2">
                                        <div>
                                            <p className="font-semibold text-slate-100 flex items-center gap-2">
                                              <FlaskIcon className="w-4 h-4 text-emerald-300"/>
                                              <span>{potion.name} <span className="text-slate-400 font-normal">({player.potions[potion.id]}/{potion.maxQuantity})</span></span>
                                              {potion.requiredBuildingLevel > 1 && potion.requiredBuildingLevel === building.level && <span className="text-xs font-normal text-violet-400">신규!</span>}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">{potion.description}</p>
                                        </div>
                                        <button
                                            onClick={() => onCraftPotion(potion.id)}
                                            disabled={cannotAfford || isMaxQuantity}
                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-70 flex-shrink-0"
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                    <CostDisplay cost={potion.cost} prefix="재료:" />
                                </div>
                            );
                          })}
                          <ProficiencyDisplay type="alchemy" />
                          {nextQuest && buildingNpc && <QuestCard
                            quest={nextQuest}
                            npc={buildingNpc}
                            onAcceptQuest={onAcceptQuest}
                            onCompleteQuest={onCompleteQuest}
                            canAfford={canAfford}
                            isLocked={
                                nextQuest.requiredReputation ?
                                getReputationLevelInfo(player.npcReputation[nextQuest.requiredReputation.npcId] || 0).level < nextQuest.requiredReputation.level
                                : false
                            }
                            npcs={npcs}
                          />}
                          {upgradeCard}
                        </div>
                      );
                    }
                    if (building.id === 'market') {
                        if (!marketBuilt) return null;
                        
                        return (
                           <div className="flex flex-col gap-2 w-full">
                              <div role="tablist" aria-label="시장 기능" className="flex items-center gap-1 p-1 rounded-lg bg-slate-900/50">
                                <button id="sell-tab" role="tab" aria-selected={marketTab === 'sell'} aria-controls="market-panel" onClick={() => setMarketTab('sell')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${marketTab === 'sell' ? 'bg-red-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700/50'}`}>판매</button>
                                <button id="buy-tab" role="tab" aria-selected={marketTab === 'buy'} aria-controls="market-panel" onClick={() => setMarketTab('buy')} className={`flex-1 py-1.5 text-sm font-bold rounded-md transition-colors ${marketTab === 'buy' ? 'bg-green-600 text-white' : 'bg-transparent text-slate-300 hover:bg-slate-700/50'}`}>구매</button>
                              </div>
                              <div id="market-panel" role="tabpanel" aria-labelledby={marketTab === 'sell' ? 'sell-tab' : 'buy-tab'}>
                                  {marketTab === 'sell' ? (
                                      <div className="space-y-2 animate-fade-in">
                                          <div className="flex items-center gap-2">
                                              <input type="number" value={sellAmount} onChange={(e) => setSellAmount(Math.max(1, parseInt(e.target.value) || 1))} className="bg-slate-900 border border-slate-600 rounded-md px-2 py-1 w-20" />
                                              <button onClick={() => onSellResource('wood', sellAmount)} className="flex-1 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm font-bold rounded-md">목재 판매 (개당 1G)</button>
                                              <button onClick={() => onSellResource('stone', sellAmount)} className="flex-1 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm font-bold rounded-md">석재 판매 (개당 1G)</button>
                                              <button onClick={() => onSellResource('iron', sellAmount)} className="flex-1 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-sm font-bold rounded-md">철광석 판매 (개당 3G)</button>
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="space-y-2 animate-fade-in">
                                          <div className="flex items-center gap-2">
                                              <input type="number" value={buyAmount} onChange={(e) => setBuyAmount(Math.max(1, parseInt(e.target.value) || 1))} className="bg-slate-900 border border-slate-600 rounded-md px-2 py-1 w-20" />
                                              <button onClick={() => onBuyResource('wood', buyAmount)} className="flex-1 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm font-bold rounded-md">목재 구매 (개당 2G)</button>
                                              <button onClick={() => onBuyResource('stone', buyAmount)} className="flex-1 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm font-bold rounded-md">석재 구매 (개당 2G)</button>
                                              {building.level >= 2 && <button onClick={() => onBuyResource('iron', buyAmount)} className="flex-1 px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm font-bold rounded-md">철광석 구매 (개당 5G)</button>}
                                          </div>
                                          {building.level < 2 && <p className="text-xs text-slate-500 text-center mt-2">시장을 2레벨로 업그레이드하면 철광석을 구매할 수 있습니다.</p>}
                                      </div>
                                  )}
                              </div>
                              {upgradeCard}
                           </div>
                        );
                    }

                    if (building.id === 'wall' || building.id === 'guard_tower') {
                      return upgradeCard;
                    }
                    
                    return null;
                  })()
                )
                ) : (
                  <button
                    onClick={() => onBuild(building.id)}
                    disabled={!canAfford(building.cost)}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-md transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
                  >
                    <HammerIcon className="w-5 h-5" />
                    건설하기
                  </button>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
      
      {/* Dungeon Entry Section */}
      <div className="mt-8">
        <button
          onClick={onEnterDungeon}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-700 hover:bg-red-600 text-white text-xl font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-2xl"
        >
          <DungeonIcon className="w-8 h-8" />
          탐험 시작하기
        </button>
      </div>
    </div>
  );
};

export default TownScreen;
